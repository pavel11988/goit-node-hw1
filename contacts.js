const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "db", "contacts.json");
const newID = require("bson-objectid");

async function listContacts() {
  const contacts = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  if (!contact) {
    return null;
  }
  return contact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const removeIndex = contacts.findIndex((contact) => contact.id === contactId);
  if (removeIndex === -1) {
    return null;
  }
  const removeContact = contacts.splice(removeIndex, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return removeContact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: newID(), name, email, phone };
  if (!newContact.id || !name.trim() || !email.trim() || !phone.trim()) {
    return null;
  }
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

const contactsOperations = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

module.exports = contactsOperations;
