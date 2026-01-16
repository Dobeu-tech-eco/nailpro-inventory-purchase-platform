import { useState } from 'react';
import { Plus, Search, Shield, Edit, Trash2, Send } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Badge } from '../../components/ui';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'owner' | 'manager' | 'staff';
  status: 'active' | 'pending';
  avatar_url: string | null;
  last_active: string | null;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah@nailsalon.com',
    role: 'owner',
    status: 'active',
    avatar_url: null,
    last_active: '2025-01-15T10:30:00Z',
  },
  {
    id: '2',
    first_name: 'Maria',
    last_name: 'Garcia',
    email: 'maria@nailsalon.com',
    role: 'manager',
    status: 'active',
    avatar_url: null,
    last_active: '2025-01-15T09:00:00Z',
  },
  {
    id: '3',
    first_name: 'Emily',
    last_name: 'Chen',
    email: 'emily@nailsalon.com',
    role: 'staff',
    status: 'active',
    avatar_url: null,
    last_active: '2025-01-14T16:00:00Z',
  },
  {
    id: '4',
    first_name: 'Jessica',
    last_name: 'Kim',
    email: 'jessica@nailsalon.com',
    role: 'staff',
    status: 'pending',
    avatar_url: null,
    last_active: null,
  },
];

const roleConfig: Record<string, { label: string; color: string; description: string }> = {
  owner: {
    label: 'Owner',
    color: 'bg-rose-100 text-rose-700',
    description: 'Full access to all features and settings',
  },
  manager: {
    label: 'Manager',
    color: 'bg-blue-100 text-blue-700',
    description: 'Can manage inventory, orders, and team members',
  },
  staff: {
    label: 'Staff',
    color: 'bg-slate-100 text-slate-700',
    description: 'Can view and update inventory',
  },
};

export function TeamPage() {
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [, setIsInviteModalOpen] = useState(false);

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatLastActive = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 5) return 'Online now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="text-slate-500">
            Manage your team members and their access permissions
          </p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team members..."
              className="pl-10"
            />
          </div>

          <Card>
            <div className="divide-y">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-lg font-medium text-white">
                        {member.first_name[0]}
                        {member.last_name[0]}
                      </div>
                      {member.status === 'active' && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900">
                          {member.first_name} {member.last_name}
                        </h3>
                        <Badge className={roleConfig[member.role].color}>
                          {roleConfig[member.role].label}
                        </Badge>
                        {member.status === 'pending' && (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{member.email}</p>
                      <p className="text-xs text-slate-400">
                        {formatLastActive(member.last_active)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {member.status === 'pending' && (
                      <Button variant="ghost" size="sm">
                        <Send className="h-4 w-4" />
                        Resend
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {member.role !== 'owner' && (
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-slate-500" />
                Roles & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(roleConfig).map(([role, config]) => (
                <div key={role} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center gap-2">
                    <Badge className={config.color}>{config.label}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{config.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Members</span>
                  <span className="font-medium text-slate-900">{teamMembers.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Active</span>
                  <span className="font-medium text-slate-900">
                    {teamMembers.filter((m) => m.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Pending Invites</span>
                  <span className="font-medium text-slate-900">
                    {teamMembers.filter((m) => m.status === 'pending').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
