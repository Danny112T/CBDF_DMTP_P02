const User = require("../models/auth.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "contraseniabyDannyjajajs";

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email == undefined || password == undefined) {
      res.status(400).json({ mensaje: "Faltan parametros" });
    } else {
      const usuario = await User.findOne({ email });
      if (usuario) {
        const passwordDB = usuario.password;
        if (passwordDB) {
          const passwordCorrect = await bcrypt.compare(password, passwordDB);
          const payload = {
            userId: usuario._id,
            userName: usuario.name,
            userLastname: usuario.lastname,
            userEmail: usuario.email,
            userUser: usuario.user,
          };
          const token = jwt.sign(payload, secretKey);
          if (passwordCorrect) {
            res
              .status(200)
              .json({ estado: 1, mensaje: "Login Successful",datosUsuario: usuario, token: token });
          } else {
            res.status(401).json({ estado: 0, mensaje: "Unauthorized" });
          }
        } else {
          res
            .status(400)
            .json({ estado: 0, mensaje: "Password not found in database" });
        }
      } else {
        res.status(404).json({ estado: 0, mensaje: "Usuario no enontrado" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ estado: 0, mensaje: "Error Desconocido" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const usuarios = await User.find().skip(skip).limit(limit);

    if (!usuarios) {
      res.status(404).json({
        estado: 0,
        mensaje: "Usuarios no encontrados",
      });
    }
    const totalDePaginas = Math.ceil(total / limit);

    res.status(200).json({
      estado: 1,
      mensaje: "Usuarios obtenidos correctamente",
      data: usuarios,
      totalDePaginas: totalDePaginas,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ estado: 0, mensaje: "Ocurrio un error desconocido" });
  }
};