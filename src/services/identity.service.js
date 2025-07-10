const { Contact } = require("../models");
const { Op } = require("sequelize");

class IdentityService {
  async identify(data) {
    const { email, phoneNumber } = data;
    const whereClause = [];
    if (email) whereClause.push({ email });
    if (phoneNumber) whereClause.push({ phoneNumber });

    const existingContacts = await Contact.findAll({
      where: {
        [Op.or]: whereClause,
      },
      order: [["createdAt", "ASC"]],
    });

    if (existingContacts.length === 0) {
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "primary",
      });
      return this.buildResponse([newContact]);
    }

    const primaryContactsMap = new Map();
    for (const contact of existingContacts) {
      const primaryId =
        contact.linkPrecedence === "primary" ? contact.id : contact.linkedId;
      if (!primaryContactsMap.has(primaryId)) {
        const primaryContact =
          existingContacts.find((c) => c.id === primaryId) ||
          (await Contact.findByPk(primaryId));
        if (primaryContact) {
          primaryContactsMap.set(primaryId, primaryContact);
        }
      }
    }

    const sortedPrimaryContacts = Array.from(primaryContactsMap.values()).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );

    const primaryContact = sortedPrimaryContacts[0];
    const contactsToReconcile = sortedPrimaryContacts.slice(1);

    if (contactsToReconcile.length > 0) {
      const idsToUpdate = contactsToReconcile.map((c) => c.id);
      await Contact.update(
        { linkedId: primaryContact.id, linkPrecedence: "secondary" },
        { where: { id: { [Op.in]: idsToUpdate } } }
      );

      await Contact.update(
        { linkedId: primaryContact.id },
        { where: { linkedId: { [Op.in]: idsToUpdate } } }
      );
    }

    const allRelatedContacts = await this.getAllRelatedContacts(
      primaryContact.id
    );
    const allEmails = new Set(
      allRelatedContacts.map((c) => c.email).filter(Boolean)
    );
    const allPhoneNumbers = new Set(
      allRelatedContacts.map((c) => c.phoneNumber).filter(Boolean)
    );

    const isNewEmail = email && !allEmails.has(email);
    const isNewPhoneNumber = phoneNumber && !allPhoneNumbers.has(phoneNumber);

    if (isNewEmail || isNewPhoneNumber) {
      await Contact.create({
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
      });
    }

    const finalContactList = await this.getAllRelatedContacts(
      primaryContact.id
    );
    return this.buildResponse(finalContactList);
  }

  async getAllRelatedContacts(primaryId) {
    const primaryContact = await Contact.findByPk(primaryId);
    const secondaryContacts = await Contact.findAll({
      where: { linkedId: primaryId },
    });
    return [primaryContact, ...secondaryContacts].filter(Boolean); // filter(Boolean) to remove nulls
  }

  buildResponse(contacts) {
    if (contacts.length === 0) {
      throw new Error("Cannot build response for empty contacts list.");
    }

    const primaryContact =
      contacts.find((c) => c.linkPrecedence === "primary") || contacts[0];

    const emails = new Set();
    const phoneNumbers = new Set();
    const secondaryContactIds = new Set();

    if (primaryContact.email) emails.add(primaryContact.email);
    if (primaryContact.phoneNumber)
      phoneNumbers.add(primaryContact.phoneNumber);

    contacts.forEach((contact) => {
      if (contact.email) emails.add(contact.email);
      if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
      if (contact.id !== primaryContact.id) {
        secondaryContactIds.add(contact.id);
      }
    });

    return {
      contact: {
        primaryContactId: primaryContact.id,
        emails: Array.from(emails),
        phoneNumbers: Array.from(phoneNumbers),
        secondaryContactIds: Array.from(secondaryContactIds),
      },
    };
  }
}

module.exports = new IdentityService();
