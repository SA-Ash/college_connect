import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ContactCard from '@/components/contacts/ContactCard';
import { useContacts, useDeleteContact, useAddContact } from '@/hooks/useContacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const { data: contacts, isLoading } = useContacts();
    const deleteContact = useDeleteContact();
    const addContact = useAddContact();

    const filteredContacts = contacts?.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddContact = async () => {
        if (!newContactPhone.trim()) return;
        try {
            await addContact.mutateAsync(newContactPhone);
            setNewContactPhone('');
            setShowAddForm(false);
        } catch (error) {
            console.error('Failed to add contact:', error);
        }
    };

    const handleDeleteContact = async (id: string) => {
        try {
            await deleteContact.mutateAsync(id);
        } catch (error) {
            console.error('Failed to delete contact:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Contacts</h2>
                        <p className="text-gray-600 mt-1">
                            Manage your connections ({contacts?.length || 0} total)
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Contact
                    </Button>
                </div>

                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Add New Contact</CardTitle>
                                </CardHeader>
                                <CardContent className="flex gap-2">
                                    <Input
                                        placeholder="1234567890"
                                        value={newContactPhone}
                                        onChange={(e) => setNewContactPhone(e.target.value)}
                                        className="flex-1"
                                        type="tel"
                                    />
                                    <Button
                                        onClick={handleAddContact}
                                        disabled={addContact.isPending || !newContactPhone.trim()}
                                    >
                                        {addContact.isPending ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            'Add'
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12"
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredContacts && filteredContacts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredContacts.map((contact, index) => (
                            <ContactCard
                                key={contact._id}
                                contact={contact}
                                onDelete={handleDeleteContact}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <UserPlus className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-600 text-center">
                                {searchQuery ? 'No contacts found' : 'No contacts yet. Add your first contact!'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
