import Community from '@/models/Community.model';
import { Types } from 'mongoose';
import { joinCommunity } from '@/services/communityService';
import { connectToDB } from "@/util/connectToDB";
import { v4 as uuidv4 } from 'uuid';   // The UUID (universally unique identifier), used to generate our invite links



export async function generateInviteLink(communityId: Types.ObjectId, userId: string) {
    await connectToDB();
    console.log('[generateInviteLink] Start');
    console.log(`[generateInviteLink] Received communityId: ${communityId}`);
    console.log(`[generateInviteLink] Received userId: ${userId}`);
  
    try {
      console.log('[generateInviteLink] Querying database...');
      const community = await Community.findById(communityId).exec(); // Added exec for better control
  
      if (!community) {
        console.error('[generateInviteLink] Community not found');
        throw new Error('Community not found');
      }
      console.log(`[generateInviteLink] Found community: ${community.name}`);
  
      console.log('[generateInviteLink] Checking if user is an admin...');
      const isAdmin = community.members.some(
        (member) => member._id.toString() === userId && member.role === 'admin'
      );
  
      if (!isAdmin) {
        console.error('[generateInviteLink] User is not an admin');
        throw new Error('You do not have permission to generate an invite link');
      }
      console.log('[generateInviteLink] User is an admin');
  
      community.settings = community.settings || {};
      community.settings.privacy = community.settings.privacy || {
        isPrivate: false,
        inviteLink: null,
        inviteExpiration: null,
      };
  
      console.log('[generateInviteLink] Generating invite token...');
      const token = uuidv4();
      const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
      community.settings.privacy.inviteLink = token;
      community.settings.privacy.inviteExpiration = expiration;
  
      console.log('[generateInviteLink] Saving community...');
      await community.save();
  
      console.log('[generateInviteLink] Community updated successfully');
      return { token, expiresAt: expiration };
    } catch (error) {
       const err = error as Error;
      console.error('[generateInviteLink] Error:', err.message);
      throw error;
    }
  }
  

// Get community through invite link so we can see description before continuing action

  export async function fetchCommunityByInvite(token: string) {
    await connectToDB();
    console.log('[fetchCommunityByInvite] Start');
    console.log(`[fetchCommunityByInvite] Received token: ${token}`);
  
    try {
      // Find the community using the invite link token
      console.log('[fetchCommunityByInvite] Querying database for token...');
      const community = await Community.findOne({ 'settings.privacy.inviteLink': token }).exec();
  
      if (!community) {
        console.error('[fetchCommunityByInvite] No community found for the given token');
        throw new Error('Invalid or expired invite link');
      }
  
      console.log('[fetchCommunityByInvite] Ensuring settings and privacy exist...');
      community.settings = community.settings || {};
      community.settings.privacy = community.settings.privacy || {
        isPrivate: false,
        inviteLink: null,
        inviteExpiration: null,
      };
  
      console.log('[fetchCommunityByInvite] Validating token expiration...');
      if (!community.settings.privacy.inviteExpiration || new Date() > community.settings.privacy.inviteExpiration) {
        console.error('[fetchCommunityByInvite] Invite link has expired');
        throw new Error('Invite link has expired');
      }
  
      console.log('[fetchCommunityByInvite] Community found:', community.name);
  
      // Return only the necessary details about the community
      return {
        id: community._id,
        name: community.name,
        description: community.description,
        isPrivate: community.settings.privacy.isPrivate,
        membersCount: community.members.length,
        creator: community.creator_ID,
      };
    } catch (error) {
      const err = error as Error;
      console.error('[fetchCommunityByInvite] Error:', err.message);
      throw error;
    }
  }
  


  export async function joinCommunityViaInvite(token: string, userId: string) {
    await connectToDB();
    console.log('[joinCommunityViaInvite] Start');
    console.log(`[joinCommunityViaInvite] Received token: ${token}`);
    console.log(`[joinCommunityViaInvite] Received userId: ${userId}`);
  
    try {
      // Find the community by the invite token
      console.log('[joinCommunityViaInvite] Finding community by token...');
      const community = await Community.findOne({ 'settings.privacy.inviteLink': token }).exec();
      console.log('[joinCommunityViaInvite] Query result:', community);
  
      if (!community) {
        console.error('[joinCommunityViaInvite] No community found for the given token');
        throw new Error('Invalid or expired invite link');
      }
  
      console.log('[joinCommunityViaInvite] Ensuring settings and privacy exist...');
      community.settings = community.settings || {};
      community.settings.privacy = community.settings.privacy || {
        isPrivate: false,
        inviteLink: null,
        inviteExpiration: null,
      };
  
      console.log('[joinCommunityViaInvite] Validating token expiration...');
      if (!community.settings.privacy.inviteExpiration || new Date() > community.settings.privacy.inviteExpiration) {
        console.error('[joinCommunityViaInvite] Invite link has expired');
        throw new Error('Invite link has expired');
      }
  
      console.log('[joinCommunityViaInvite] Validating userId...');
      if (!Types.ObjectId.isValid(userId)) {
        console.error('[joinCommunityViaInvite] Invalid user ID');
        throw new Error('Invalid user ID');
      }
      const userObjectId = new Types.ObjectId(userId);
      console.log('[joinCommunityViaInvite] Converted userId to ObjectId:', userObjectId);
  
      console.log('[joinCommunityViaInvite] Adding user to community...');
      const result = await joinCommunity(community._id as Types.ObjectId, userObjectId);
      console.log('[joinCommunityViaInvite] Successfully added user to community:', result);
  
      return result;
    } catch (error) {
      const err = error as Error;
      console.error('[joinCommunityViaInvite] Error:', err.message);
      throw error;
    }
  }
  


  export async function revokeInviteLink(communityId: Types.ObjectId, userId: string) {
    await connectToDB();
    const community = await Community.findById(communityId);
  
    if (!community) {
      throw new Error('Community not found');
    }
  
    const isAdmin = community.members.some(
      (member) => member._id.equals(new Types.ObjectId(userId)) && member.role === 'admin'
    );
    if (!isAdmin) {
      throw new Error('You do not have permission to revoke the invite link');
    }
  
    community.settings = community.settings || {};
    community.settings.privacy = community.settings.privacy || {
      isPrivate: false,
      inviteLink: null,
      inviteExpiration: null,
    };
  
    community.settings.privacy.inviteLink = null;
    community.settings.privacy.inviteExpiration = null;
  
    await community.save();
  
    return community; // Return the updated community for confirmation
  }