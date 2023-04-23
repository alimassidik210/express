const { json } = require("express");
const fs = require("fs");

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// ambil semua data contact.json
const loadContacts = () => {
  const file = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

// cari contact berdasarkan nama
const findContact = (nama) => {
  const contacts = loadContacts();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  return contact;
};

// menimpa file contacts json dengan data yg
const saveContacs = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

// menambahan dta contact baru
const addContact = (contact) => {
  const contacts = loadContacts();
  contacts.push(contact);
  saveContacs(contacts);
};

// cek nama yang duplikat
const cekDuplikat = (nama) => {
  const contatcs = loadContacts();
  return contatcs.find((contact) => contact.nama === nama);
};

// hapus contact
const deleteContact = (nama) => {
  const contacts = loadContacts();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContacs(filteredContacts);
};

// update contact
const updateContacts = (contactBaru) => {
  const contacts = loadContacts();
  // hilangkan contact lama yang namanya sama dengan oldnama
  const filteredContacts = contacts.filter(
    (contact) => contact.nama !== contactBaru.oldnama
  );
  delete contactBaru.oldnama;
  filteredContacts.push(contactBaru);
  saveContacs(filteredContacts);
};

module.exports = {
  loadContacts,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContacts,
};
