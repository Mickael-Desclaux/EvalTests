jest.mock("axios", () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
    },
}));

import axios from "axios";
import { getCDs, addCD, deleteCD } from "../cdService";

const API_URL = "http://localhost:5005/api/cds";

beforeEach(() => {
    jest.clearAllMocks();
});

describe("getCDs", () => {
    it("appel GET sur l'URL de l'API et renvoie les données", async () => {
        const cds = [{ id: 1, title: "A", artist: "Art", year: 2001 }];
        axios.get.mockResolvedValue({ data: cds });

        const result = await getCDs();

        expect(axios.get).toHaveBeenCalledWith(API_URL);
        expect(result).toEqual(cds);
    });
});

describe("addCD", () => {
    it("appelle POST avec le CD et renvoie la ressource créée", async () => {
        const payload = { title: "B", artist: "Art2", year: 2002 };
        const created = { id: 2, ...payload };
        axios.post.mockResolvedValue({ data: created });

        const result = await addCD(payload);

        expect(axios.post).toHaveBeenCalledWith(API_URL, payload);
        expect(result).toEqual(created);
    });
});

describe("deleteCD", () => {
    it("appelle DELETE avec l'id concaténé à l'URL", async () => {
        axios.delete.mockResolvedValue({});

        await deleteCD(7);

        expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/7`);
    });
});
