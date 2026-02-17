import { Hono } from "hono";
import { getPrediction } from "./getPrediction";

const server = new Hono();

server.post("/single/multipart-form", async (c) => {
	const body = await c.req.parseBody();
	const image = body.content;
	if (typeof image === "string") {
		return c.json({ error: "invalid content" });
	}
	const buffer = await image?.arrayBuffer();
	if (!buffer) {
		return c.json({ error: "invalid content" });
	}
	return c.json({ prediction: await getPrediction(Buffer.from(buffer)) });
});
server.post("/multiple/multipart-form", async (c) => {
	const body = await c.req.parseBody({ all: true });
	const contents = body.contents;
	if (!contents) {
		return c.json({ error: "no contents field provided" }, 400);
	}
	const files = Array.isArray(contents) ? contents : [contents];
	const imageFiles = files.filter((item): item is File => item instanceof File);
	if (imageFiles.length !== files.length || imageFiles.length === 0) {
		return c.json({ error: "invalid contents fields" }, 400);
	}
	const predictions = await Promise.all(
		imageFiles.map(async (file) => {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			return getPrediction(buffer);
		}),
	);
	return c.json({ predictions });
});

export default {
	port: 3333,
	fetch: server.fetch,
};
