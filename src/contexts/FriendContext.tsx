
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

type FriendRequest = {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
};

type Friend = {
  id: string;
  name: string;
  email: string;
};

type FriendsMap = Record<string, Friend>;
type FriendRequestsMap = Record<string, FriendRequest>;

type FriendContextType = {
  friends: Friend[];
  friendRequests: FriendRequest[];
  sendFriendRequest: (email: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (friendId: string) => void;
  isFriend: (userId: string) => boolean;
  hasPendingRequest: (userId: string) => boolean;
  hasSentRequest: (userId: string) => boolean;
};

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export const FriendProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [friendsMap, setFriendsMap] = useState<FriendsMap>({});
  const [friendRequestsMap, setFriendRequestsMap] = useState<FriendRequestsMap>({});

  // Load friends and requests from localStorage
  useEffect(() => {
    if (user) {
      const savedFriends = localStorage.getItem('user-friends');
      const savedRequests = localStorage.getItem('friend-requests');
      
      if (savedFriends) {
        setFriendsMap(JSON.parse(savedFriends));
      }
      
      if (savedRequests) {
        setFriendRequestsMap(JSON.parse(savedRequests));
      }
    } else {
      setFriendsMap({});
      setFriendRequestsMap({});
    }
  }, [user]);

  // Save to localStorage when data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user-friends', JSON.stringify(friendsMap));
      localStorage.setItem('friend-requests', JSON.stringify(friendRequestsMap));
    }
  }, [friendsMap, friendRequestsMap, user]);

  // Convert maps to arrays for easier consumption by components
  const friends = Object.values(friendsMap);
  
  const friendRequests = Object.values(friendRequestsMap).filter(
    request => request.toUserId === user?.id && request.status === 'pending'
  );

  const sendFriendRequest = (email: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to send friend requests.',
        variant: 'destructive',
      });
      return;
    }

    // Check if trying to add self
    if (user.email === email) {
      toast({
        title: 'Invalid operation',
        description: 'You cannot add yourself as a friend.',
        variant: 'destructive',
      });
      return;
    }

    // Mock finding a user by email (in a real app, this would query a database)
    const foundUser = [
      { id: '1', name: 'Admin User', email: 'admin@example.com' },
      { id: '2', name: 'Regular User', email: 'user@example.com' },
    ].find(u => u.email === email);

    if (!foundUser) {
      toast({
        title: 'User not found',
        description: 'No user with that email address was found.',
        variant: 'destructive',
      });
      return;
    }

    // Check if already friends
    if (friendsMap[foundUser.id]) {
      toast({
        title: 'Already friends',
        description: `You are already friends with ${foundUser.name}.`,
        variant: 'destructive',
      });
      return;
    }

    // Check if request already sent
    const existingRequest = Object.values(friendRequestsMap).find(
      req => 
        (req.fromUserId === user.id && req.toUserId === foundUser.id) || 
        (req.fromUserId === foundUser.id && req.toUserId === user.id)
    );

    if (existingRequest) {
      toast({
        title: 'Request exists',
        description: `A friend request between you and ${foundUser.name} already exists.`,
        variant: 'destructive',
      });
      return;
    }

    // Create a new request
    const newRequest: FriendRequest = {
      id: `req-${Date.now()}`,
      fromUserId: user.id,
      fromUserName: user.name,
      toUserId: foundUser.id,
      status: 'pending',
    };

    setFriendRequestsMap(prev => ({
      ...prev,
      [newRequest.id]: newRequest
    }));

    toast({
      title: 'Friend request sent',
      description: `Friend request sent to ${foundUser.name}.`,
    });
  };

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequestsMap[requestId];
    if (!request) return;

    // Mock finding user by ID
    const userMap = {
      '1': { id: '1', name: 'Admin User', email: 'admin@example.com' },
      '2': { id: '2', name: 'Regular User', email: 'user@example.com' },
    };
    
    const fromUser = userMap[request.fromUserId];
    
    if (!fromUser) return;

    // Add as friend
    setFriendsMap(prev => ({
      ...prev,
      [fromUser.id]: fromUser
    }));

    // Update request status
    setFriendRequestsMap(prev => ({
      ...prev,
      [requestId]: { ...request, status: 'accepted' }
    }));

    toast({
      title: 'Friend request accepted',
      description: `You are now friends with ${fromUser.name}.`,
    });
  };

  const rejectFriendRequest = (requestId: string) => {
    const request = friendRequestsMap[requestId];
    if (!request) return;

    // Update request status
    setFriendRequestsMap(prev => ({
      ...prev,
      [requestId]: { ...request, status: 'rejected' }
    }));

    toast({
      title: 'Friend request rejected',
    });
  };

  const removeFriend = (friendId: string) => {
    if (!friendsMap[friendId]) return;

    const friendName = friendsMap[friendId].name;

    // Remove friend
    setFriendsMap(prev => {
      const newMap = { ...prev };
      delete newMap[friendId];
      return newMap;
    });

    toast({
      title: 'Friend removed',
      description: `${friendName} has been removed from your friends.`,
    });
  };

  const isFriend = (userId: string): boolean => {
    return Boolean(friendsMap[userId]);
  };

  const hasPendingRequest = (userId: string): boolean => {
    return Object.values(friendRequestsMap).some(
      req => req.fromUserId === userId && req.toUserId === user?.id && req.status === 'pending'
    );
  };

  const hasSentRequest = (userId: string): boolean => {
    return Object.values(friendRequestsMap).some(
      req => req.fromUserId === user?.id && req.toUserId === userId && req.status === 'pending'
    );
  };

  return (
    <FriendContext.Provider
      value={{
        friends,
        friendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        isFriend,
        hasPendingRequest,
        hasSentRequest,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendContext);
  if (context === undefined) {
    throw new Error('useFriends must be used within a FriendProvider');
  }
  return context;
};
