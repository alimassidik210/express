const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContacts,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts,
} = require("./utils/contact");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

// gunkakan ejs
app.set("view engine", "ejs");

// third party middleware
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

app.get("/", (req, res) => {
  const mahasiswa = [
    { nama: "alim assidik", email: "alim@123" },
    { nama: "karin", email: "alim@123" },
    { nama: "riri", email: "alim@123" },
  ];
  res.render("index", {
    nama: "alim asisidk",
    title: "Halaman Home",
    mahasiswa,
    layout: "layouts/main-layouts",
  });
});

app.get("/about", (req, res, next) => {
  res.render("about", {
    layout: "layouts/main-layouts",
    title: "Halaman About",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContacts();
  console.log(contacts);
  res.render("contact", {
    layout: "layouts/main-layouts",
    title: "Halaman Contact",
    contacts,
    msg: req.flash("msg"),
  });
});

// halaman form tambah data kontak
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "From Tambah Data Contact",
    layout: "layouts/main-layouts",
  });
});

// proses data kontak
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("Nama kontak sudah digunakan");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No Hp tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(404).json({ errors: errors.array() });
      res.render("add-contact", {
        title: "From Tambah Data Contact",
        layout: "layouts/main-layouts",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      req.flash("msg", "Data contact berhasil ditambahkan!");
      res.redirect("/contact");
    }
  }
);

// Proses delete contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  // jika kontak tidak ada
  if (!contact) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Data contact berhasil dihapus!");
    res.redirect("/contact");
  }
});

// halaman form ubah data kontak
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("edit-contact", {
    title: "From Ubah Data Contact",
    layout: "layouts/main-layouts",
    contact,
  });
});

app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldnama && duplikat) {
        throw new Error("Nama kontak sudah digunakan");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No Hp tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(404).json({ errors: errors.array() });
      res.render("edit-contact", {
        title: "From Ubah Data Contact",
        layout: "layouts/main-layouts",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContacts(req.body);
      req.flash("msg", "Data contact berhasil diubah!");
      res.redirect("/contact");
    }
  }
);

app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("detail", {
    layout: "layouts/main-layouts",
    title: "Halaman Detail Contact",
    contact,
  });
});

app.use((req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
