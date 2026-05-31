import prisma from "../../config/prisma.js";

export const getPositions = async (req, res) => {
  try {
    const positions = await prisma.position.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ status: true, data: positions });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const createPosition = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingPosition = await prisma.position.findUnique({
      where: { name },
    });

    if (existingPosition) {
      return res
        .status(400)
        .json({ status: false, message: "Position already exists." });
    }

    const position = await prisma.position.create({
      data: { name, description },
    });

    res.status(201).json({
      status: true,
      message: "Position created successfully",
      data: position,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if another position has the same name
    if (name) {
      const existingPosition = await prisma.position.findFirst({
        where: {
          name,
          id: { not: id },
        },
      });

      if (existingPosition) {
        return res
          .status(400)
          .json({ status: false, message: "Position name already exists." });
      }
    }

    const position = await prisma.position.update({
      where: { id },
      data: { name, description },
    });

    res.status(200).json({
      status: true,
      message: "Position updated successfully",
      data: position,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const deletePosition = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.position.delete({
      where: { id },
    });

    res.status(200).json({
      status: true,
      message: "Position deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: false, message: error.message });
  }
};
