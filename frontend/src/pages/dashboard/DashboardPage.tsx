import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { Users, UserPlus, Activity } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const { data: contacts } = useContacts();

    const stats = [
        {
            title: 'Total Contacts',
            value: contacts?.length || 0,
            icon: Users,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Active Today',
            value: contacts?.length || 0,
            icon: Activity,
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'New This Week',
            value: 0,
            icon: UserPlus,
            color: 'from-pink-500 to-pink-600',
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name}!
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Here's what's happening with your contacts today.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardDescription>{stat.title}</CardDescription>
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{stat.value}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Manage your contacts and connections</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <Link to="/contacts">
                            <Button className="gap-2">
                                <Users className="w-4 h-4" />
                                View All Contacts
                            </Button>
                        </Link>
                        <Link to="/contacts">
                            <Button variant="outline" className="gap-2">
                                <UserPlus className="w-4 h-4" />
                                Add New Contact
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
