import { models } from "../db";

const { Program } = models;

export async function getPrograms() {
    return await Program.findAll();
}
