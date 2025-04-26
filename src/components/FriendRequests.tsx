
import React from 'react';
import { useFriends } from '@/contexts/FriendContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const FriendRequests: React.FC = () => {
  const { friendRequests, acceptFriendRequest, rejectFriendRequest } = useFriends();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {friendRequests.length > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex items-center justify-center">
              {friendRequests.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <DropdownMenuLabel>Friend Requests</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {friendRequests.length === 0 ? (
            <DropdownMenuItem disabled>No pending friend requests</DropdownMenuItem>
          ) : (
            friendRequests.map((request) => (
              <DropdownMenuItem key={request.id} className="flex flex-col items-start p-3">
                <div className="text-sm font-medium mb-1">{request.fromUserName}</div>
                <div className="flex gap-2 mt-1 w-full justify-end">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      rejectFriendRequest(request.id);
                    }} 
                    variant="ghost" 
                    size="sm"
                  >
                    Decline
                  </Button>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      acceptFriendRequest(request.id);
                    }} 
                    variant="default" 
                    size="sm"
                  >
                    Accept
                  </Button>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
