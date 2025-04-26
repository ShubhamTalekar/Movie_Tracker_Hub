
import React from 'react';
import { useFriends } from '@/contexts/FriendContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type FriendRequestButtonProps = {
  userId: string;
  userEmail: string;
  userName: string;
};

export const FriendRequestButton: React.FC<FriendRequestButtonProps> = ({ 
  userId, userEmail, userName 
}) => {
  const { 
    sendFriendRequest,
    isFriend,
    hasPendingRequest,
    hasSentRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    friendRequests,
    removeFriend
  } = useFriends();
  
  const isUserFriend = isFriend(userId);
  const isPending = hasPendingRequest(userId);
  const hasSent = hasSentRequest(userId);
  
  const handleSendFriendRequest = () => {
    sendFriendRequest(userEmail);
  };

  const handleAcceptFriendRequest = () => {
    // Find the request ID for this user
    const request = friendRequests.find(req => req.fromUserId === userId);
    if (request) {
      acceptFriendRequest(request.id);
      toast({
        title: 'Friend request accepted',
        description: `You are now friends with ${userName}.`,
      });
    }
  };
  
  const handleRejectFriendRequest = () => {
    const request = friendRequests.find(req => req.fromUserId === userId);
    if (request) {
      rejectFriendRequest(request.id);
      toast({
        title: 'Friend request rejected',
      });
    }
  };

  const handleRemoveFriend = () => {
    removeFriend(userId);
  };

  if (isPending) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Friend request received</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAcceptFriendRequest}>Accept</Button>
          <Button size="sm" variant="outline" onClick={handleRejectFriendRequest}>Reject</Button>
        </div>
      </div>
    );
  }

  if (hasSent) {
    return (
      <Button variant="outline" disabled>
        Friend Request Sent
      </Button>
    );
  }

  if (isUserFriend) {
    return (
      <Button variant="outline" onClick={handleRemoveFriend}>
        Remove Friend
      </Button>
    );
  }

  return (
    <Button onClick={handleSendFriendRequest}>
      Send Friend Request
    </Button>
  );
};
