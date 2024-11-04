import Community from '@/models/Community.model';
import { Types } from 'mongoose';

export async function findCommunityIdOrSlug(identifier: string | Types.ObjectId) {
  if (Types.ObjectId.isValid(identifier)) {
    return await Community.findById(identifier);
  } else {
    return await Community.findOne({ slug: identifier });
  }
}