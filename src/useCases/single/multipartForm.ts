import type { FastifyReply, FastifyRequest } from "fastify";
import type { FromSchema } from "json-schema-to-ts";
import { getPrediction } from "../../getPrediction.js";

export const singleMultipartFormBodySchema = {
	type: "object",
	properties: {
		content: {
			type: "array",
			items: {
				$ref: "#mySharedSchema",
			},
		},
	},
	required: ["content"],
} as const;

type BodyEntry = {
	data: Buffer;
	filename: string;
	encoding: string;
	mimetype: string;
	limit: false;
};

export async function SingleMultipartForm(
	request: FastifyRequest<{
		Body: FromSchema<typeof singleMultipartFormBodySchema>;
	}>,
	reply: FastifyReply,
) {
	const image = request.body.content[0] as BodyEntry;

	return reply.send({
		prediction: await getPrediction(image.data),
	});
}
