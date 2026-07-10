import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { getCDs, addCD, deleteCD } from "../cdService";

const API_URL = "http://localhost:5005/api/cds";

let store;

const server = setupServer(
    http.get(API_URL, () => HttpResponse.json(store)),

    http.post(API_URL, async ({ request }) => {
        const body = await request.json();
        const created = { id: store.length + 1, ...body };
        store.push(created);
        return HttpResponse.json(created, { status: 201 });
    }),

    http.delete(`${API_URL}/:id`, ({ params }) => {
        store = store.filter((cd) => String(cd.id) !== String(params.id));
        return new HttpResponse(null, { status: 204 });
    }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
    store = [{ id: 1, title: "Creep", artist: "Radiohead", year: 1992 }];
});

describe("cdService contre une API mockée (msw)", () => {
    it("getCDs récupère et parse le tableau de CD", async () => {
        const result = await getCDs();
        expect(result).toEqual(store);
    });

    it("addCD envoie le bon payload et reçoit la ressource créée", async () => {
        const payload = { title: "Nevermind", artist: "Nirvana", year: 1991 };

        const created = await addCD(payload);

        expect(created).toMatchObject(payload);
        expect(created.id).toBeDefined();

        const all = await getCDs();
        expect(all).toHaveLength(2);
        expect(all.map((c) => c.title)).toContain("Nevermind");
    });

    it("deleteCD supprime le CD ciblé côté serveur", async () => {
        await deleteCD(1);

        const all = await getCDs();
        expect(all).toHaveLength(0);
    });
});
