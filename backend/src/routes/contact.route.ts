import { Router } from 'express';
import { getAllContacts, createContact, getContactById, updateContactById, deleteContactById } from '../controllers/contact.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get("/", authenticateToken, getAllContacts);
router.post("/", authenticateToken, createContact);
router.get("/:id", authenticateToken, getContactById);
router.put("/:id", authenticateToken, updateContactById);
router.delete("/:id", authenticateToken, deleteContactById);

export default router;
