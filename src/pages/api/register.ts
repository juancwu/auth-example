import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  await prisma.$connect();

  const { username, password, email, name } = req.body;

  const existingUser = await prisma.users.findUnique({
    where: {
      username: username,
    },
  });

  if (existingUser) {
    return res.status(401).json({ message: "use another username or email" });
  }

  const user = await prisma.users.create({
    data: {
      username,
      name,
      password,
      email,
    },
  });

  res.status(200).json(user);
}
