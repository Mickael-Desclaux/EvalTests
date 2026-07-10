const request = require("supertest");
const app = require("../../app");
const pool = require("../../configs/db");

beforeEach(async () => {
    await pool.query("TRUNCATE cds RESTART IDENTITY");
});

afterAll(async () => {
    await pool.end();
});

describe("POST /api/cds", () => {
    it("crée un CD (201) et le persiste en base", async () => {
        const payload = {
            title: "OK Computer",
            artist: "Radiohead",
            year: 1997,
        };

        const res = await request(app).post("/api/cds").send(payload);

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(payload);
        expect(res.body.id).toBeDefined();

        const check = await request(app).get("/api/cds");
        expect(check.body).toHaveLength(1);
        expect(check.body[0]).toMatchObject(payload);
    });
});

describe("GET /api/cds", () => {
    it("renvoie un tableau vide quand il n'y a aucun CD", async () => {
        const res = await request(app).get("/api/cds");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("renvoie les CD triés par id croissant", async () => {
        await request(app)
            .post("/api/cds")
            .send({ title: "A", artist: "Art1", year: 2001 });
        await request(app)
            .post("/api/cds")
            .send({ title: "B", artist: "Art2", year: 2002 });

        const res = await request(app).get("/api/cds");

        expect(res.status).toBe(200);
        expect(res.body.map((c) => c.title)).toEqual(["A", "B"]);
        expect(res.body[0].id).toBeLessThan(res.body[1].id);
    });
});

describe("DELETE /api/cds/:id", () => {
    it("supprime un CD (204) qui disparaît ensuite de la liste", async () => {
        const created = await request(app)
            .post("/api/cds")
            .send({ title: "Thriller", artist: "Michael Jackson", year: 1982 });
        const id = created.body.id;

        const del = await request(app).delete(`/api/cds/${id}`);
        expect(del.status).toBe(204);

        const check = await request(app).get("/api/cds");
        expect(check.body).toHaveLength(0);
    });
});
