
import React from 'react';
import { useFriends } from '@/contexts/FriendContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserX } from 'lucide-react';

export const FriendList: React.FC = () => {
  const { friends, removeFriend } = useFriends();
  const navigate = useNavigate();

  if (friends.length === 0) {
    return (
      <div className="text-center p-4 bg-muted/30 rounded-md">
        <p className="text-muted-foreground">You haven't added any friends yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {friends.map(friend => (
        <div key={friend.id} className="flex items-center justify-between p-3 bg-card rounded-md shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {friend.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{friend.name}</div>
              <div className="text-sm text-muted-foreground">{friend.email}</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => removeFriend(friend.id)}
              title="Remove friend"
            >
              <UserX size={18} />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/profile/${friend.id}`)}
            >
              View Profile
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
