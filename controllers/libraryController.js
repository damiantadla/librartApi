const Library = require("../models/library");
const fs = require("fs").promises;

const newBook = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!req.files || !req.files.image || req.files.image.length === 0) {
    return res.status(400).json({ message: "Please upload an image" });
  }

  const url = req.files.image[0].destination + "/" + req.files.image[0].filename;
  const { title, description, author } = req.body;

  if (!title || !description || !author) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const project = await Library.create({
      title,
      description,
      author,
      urlImg: url,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  const { id, title, description, author } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Please provide an id" });
  }

  let url;
  if (req.files && req.files.image && req.files.image.length > 0) {
    url = req.files.image[0].destination + "/" + req.files.image[0].filename;
  }

  if (!title || !description || !author) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const checkProject = await Library.findById(id);

    if (!checkProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (url && checkProject.urlImg) {
      await fs.unlink(checkProject.urlImg);
    }

    const project = await Library.findByIdAndUpdate(
        id,
        {
          title,
          description,
          author,
          urlImg: url || checkProject.urlImg,
        },
        { new: true }
    );

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Please provide an id" });
  }

  try {
    const checkProject = await Library.findById(id);

    if (!checkProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (checkProject.urlImg) {
      await fs.unlink(checkProject.urlImg);
    }

    await Library.findByIdAndDelete(id);
    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const projects = await Library.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBookID = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Please provide an id" });
  }

  try {
    const project = await Library.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  newBook,
  updateBook,
  deleteBook,
  getBooks,
  getBookID,
};
