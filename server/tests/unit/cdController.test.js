jest.mock("../../configs/db");

const pool = require("../../configs/db");
const cdController = require("../../Controllers/cdController");

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("getAllCDs", () => {
    it("renvoie la liste des CD triés", async () => {
        const rows = [
            {
                id: 1,
                title: "Turn your back",
                artist: "Billy Talent",
                year: 1997,
            },
            { id: 2, title: "Piano Man", artist: "Billy Joel", year: 1991 },
        ];
        pool.query.mockResolvedValue({ rows });
        const req = {};
        const res = mockRes();

        await cdController.getAllCDs(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM cds ORDER BY id ASC",
        );
        expect(res.json).toHaveBeenCalledWith(rows);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("renvoie 500 en cas d'erreur DB", async () => {
        pool.query.mockRejectedValue(new Error("db down"));
        const req = {};
        const res = mockRes();

        await cdController.getAllCDs(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "db down" });
    });
});

describe("addCD", () => {
    it("crée un CD et renvoie 201 avec la ligne insérée", async () => {
        const created = {
            id: 5,
            title: "Fuck You",
            artist: "Lily Allen",
            year: 2008,
        };
        pool.query.mockResolvedValue({ rows: [created] });
        const req = {
            body: { title: "Fuck You", artist: "Lily Allen", year: 2008 },
        };
        const res = mockRes();

        await cdController.addCD(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            "INSERT INTO cds (title, artist, year) VALUES ($1, $2, $3) RETURNING *",
            ["Fuck You", "Lily Allen", 2008],
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(created);
    });

    it("renvoie 500 en cas d'erreur DB", async () => {
        pool.query.mockRejectedValue(new Error("insert failed"));
        const req = { body: { title: "X", artist: "Y", year: 2000 } };
        const res = mockRes();

        await cdController.addCD(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "insert failed" });
    });
});

describe("deleteCD", () => {
    it("supprime un CD et renvoie 204 sans contenu", async () => {
        pool.query.mockResolvedValue({});
        const req = { params: { id: "3" } };
        const res = mockRes();

        await cdController.deleteCD(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            "DELETE FROM cds WHERE id = $1",
            ["3"],
        );
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it("renvoie 500 en cas d'erreur DB", async () => {
        pool.query.mockRejectedValue(new Error("delete failed"));
        const req = { params: { id: "3" } };
        const res = mockRes();

        await cdController.deleteCD(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "delete failed" });
    });
});
