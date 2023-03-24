import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  const user = await prisma.users.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isValidPassword = user.password === password;

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const session = {
    user: { id: user.id, email: user.email, name: user.name },
  };

  console.log(session);

  res.status(200).json(session);
}
