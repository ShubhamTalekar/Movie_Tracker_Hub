
import React, { useState } from 'react';
import { useFriends } from '@/contexts/FriendContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';

export const AddFriendForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const { sendFriendRequest } = useFriends();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      sendFriendRequest(email.trim());
      setEmail('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="friendEmail">Add a Friend</Label>
        <div className="flex gap-2">
          <Input
            id="friendEmail"
            type="email"
            placeholder="Friend's email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="shrink-0">
            <UserPlus size={18} className="mr-2" />
            Add
          </Button>
        </div>
      </div>
    </form>
  );
};
