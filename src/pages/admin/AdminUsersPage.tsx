import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Shield,
  User,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Ban
} from 'lucide-react';
import { useAdminStore } from '@/store';
import type { User as UserType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock users data
const mockUsers = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@agency.com', role: 'agency', plan: 'pro', status: 'active', credits: 450, lastActive: '2 minutes ago' },
  { id: '2', name: 'Marcus Johnson', email: 'marcus@brand.com', role: 'creator', plan: 'pro', status: 'active', credits: 230, lastActive: '15 minutes ago' },
  { id: '3', name: 'Elena Rodriguez', email: 'elena@studio.com', role: 'creator', plan: 'starter', status: 'active', credits: 45, lastActive: '1 hour ago' },
  { id: '4', name: 'Tom Wilson', email: 'tom@bigagency.com', role: 'agency', plan: 'enterprise', status: 'active', credits: 2500, lastActive: '3 hours ago' },
  { id: '5', name: 'Lisa Park', email: 'lisa@freelance.com', role: 'creator', plan: 'starter', status: 'suspended', credits: 0, lastActive: '2 days ago' },
  { id: '6', name: 'David Kim', email: 'david@startup.com', role: 'creator', plan: 'pro', status: 'active', credits: 180, lastActive: '5 hours ago' },
  { id: '7', name: 'Amanda Foster', email: 'amanda@corp.com', role: 'agency', plan: 'enterprise', status: 'active', credits: 5000, lastActive: '30 minutes ago' },
  { id: '8', name: 'James Brown', email: 'james@test.com', role: 'creator', plan: 'free', status: 'inactive', credits: 0, lastActive: '1 week ago' },
];

const roleColors: Record<string, string> = {
  admin: 'bg-red-500/10 text-red-500',
  agency: 'bg-blue-500/10 text-blue-500',
  creator: 'bg-green-500/10 text-green-500',
  expert: 'bg-purple-500/10 text-purple-500',
};

const planColors: Record<string, string> = {
  free: 'bg-gray-500/10 text-gray-500',
  starter: 'bg-blue-500/10 text-blue-500',
  pro: 'bg-[#D8A34A]/10 text-[#D8A34A]',
  enterprise: 'bg-purple-500/10 text-purple-500',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-500',
  inactive: 'bg-gray-500/10 text-gray-500',
  suspended: 'bg-red-500/10 text-red-500',
};

export default function AdminUsersPage() {
  const { users, setUsers } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const displayUsers = users.length > 0 ? users : mockUsers;

  const filteredUsers = displayUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    // In real app, call API to delete user
    console.log('Delete user:', userId);
  };

  const handleSuspendUser = (userId: string) => {
    // In real app, call API to suspend user
    console.log('Suspend user:', userId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#F6F6F6]">Users</h2>
          <p className="text-sm text-[#666]">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 text-[#F6F6F6] hover:bg-white/5">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]">
            <User className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-[#0F0F11] border-white/5">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-[#F6F6F6] placeholder:text-[#666]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#0F0F11] border-white/5">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-sm font-medium text-[#666]">User</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666]">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666]">Plan</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666]">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666]">Credits</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666]">Last Active</th>
                  <th className="text-right p-4 text-sm font-medium text-[#666]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D8A34A] to-[#B8832F] flex items-center justify-center">
                          <span className="text-sm font-medium text-[#0B0B0D]">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#F6F6F6]">{user.name}</p>
                          <p className="text-xs text-[#666]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={cn("capitalize", roleColors[user.role])}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={cn("capitalize", planColors[user.plan])}>
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={cn("capitalize", statusColors[user.status || 'inactive'])}>
                        {user.status || 'inactive'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[#F6F6F6]">{user.credits.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[#A7A7A7]">{user.lastActive}</span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-[#666] hover:text-[#F6F6F6]">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0F0F11] border-white/10">
                          <DropdownMenuItem 
                            onClick={() => handleEditUser(user as UserType)}
                            className="text-[#A7A7A7] focus:text-[#F6F6F6] focus:bg-white/5"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleSuspendUser(user.id)}
                            className="text-[#A7A7A7] focus:text-[#F6F6F6] focus:bg-white/5"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#0F0F11] border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F6F6F6]">Edit User</DialogTitle>
            <DialogDescription className="text-[#666]">
              Update user details and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm text-[#A7A7A7] mb-2">Name</label>
                <Input 
                  defaultValue={selectedUser.name}
                  className="bg-white/5 border-white/10 text-[#F6F6F6]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A7A7A7] mb-2">Email</label>
                <Input 
                  defaultValue={selectedUser.email}
                  className="bg-white/5 border-white/10 text-[#F6F6F6]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A7A7A7] mb-2">Role</label>
                <select 
                  defaultValue={selectedUser.role}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-[#F6F6F6]"
                >
                  <option value="creator">Creator</option>
                  <option value="agency">Agency</option>
                  <option value="expert">Expert</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#A7A7A7] mb-2">Plan</label>
                <select 
                  defaultValue={selectedUser.plan}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-[#F6F6F6]"
                >
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1 border-white/10 text-[#F6F6F6] hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1 bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
