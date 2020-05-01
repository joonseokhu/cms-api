import { useQuery, optionalEnum, isEqualID } from '@utils/db';

import { Entity } from '@/models/UserContent.model';
import { USER } from '@/api/interfaces';
import { response } from '@/api';

interface VoteParams<T> {
  entity: T;
  user: USER;
  voteType: string;
  voteMethod: string;
}
interface VoteResult {
  voteUps?: USER[];
  voteDowns?: USER[];
}
export const vote = <T extends Entity>(params: VoteParams<T>): VoteResult => {
  const {
    entity, user,
  } = params;

  const isVoteUp = (voteType => {
    switch (voteType) {
      case 'up': return true;
      case 'down': return false;
      default: throw response.NO(403, 'vote type has to be either "up" or "down"');
    }
  })(params.voteType);

  const isIncrementing = (voteMethod => {
    switch (voteMethod) {
      case 'post': return true;
      case 'delete': return false;
      default: throw response.NO(403, 'vote method has to be either "post" or "delete"');
    }
  })(params.voteMethod.toLowerCase());

  if (!user) {
    throw response.NO(403, 'Only Users can vote');
  }
  const userId = user?.id;

  const { voteUps, voteDowns } = entity;

  const hasVotedUp = voteUps.includes(userId);
  const hasVotedDown = voteDowns.includes(userId);

  if (isEqualID(entity.createdBy, user.id)) {
    // 스스로에게 추천/비추천 하려 할때
    throw response.NO(403, 'Cannot vote oneself');
  }

  const nextVote = (() => {
    // 추천을 취소할 때
    if (hasVotedUp && isVoteUp && !isIncrementing) {
      return {
        voteUps: voteUps.filter(voteUp => !isEqualID(voteUp, userId)),
      };
    }

    // 비추천을 취소할때
    if (hasVotedDown && !isVoteUp && !isIncrementing) {
      return {
        voteDowns: voteDowns.filter(voteDown => !isEqualID(voteDown, userId)),
      };
    }

    // 새로 추천/비추천 할때
    if (!(hasVotedUp || hasVotedDown) && isIncrementing) {
      const key = isVoteUp ? 'voteUps' : 'voteDowns';
      return {
        [key]: entity[key].concat(userId),
      };
    }

    // 그 외 경우는 던짐
    throw response.NO(403, 'Invalid vote', {
      hasVotedUp,
      hasVotedDown,
      isVoteUp,
      isIncrementing,
    });
  })();

  return nextVote;
};

interface IsOwnerParams <T>{
  entity: T;
  user: USER;
}
type IsOwner = <T extends Entity>(params: IsOwnerParams<T>) => boolean;
export const isOwner: IsOwner = ({ entity, user }) => {
  const result = isEqualID(entity.createdBy, user.id);
  return result;
};
