import api from './api.service';

export type LotteryWinner = {
  id: string;
  guestName: string;
  rewardLabel: string;
  rewardEmoji: string;
  createdAt: string;
};

export type LotteryPlayResult = {
  won: boolean;
  reward: { label: string; emoji: string } | null;
  entryId: string;
};

/** No guest identity is captured or sent — `visitorId` is the only identifier, and it's anonymous. */
export async function playLottery(workspaceId: number | string, visitorId: string) {
  return api.post<LotteryPlayResult>(`/public/lottery/${workspaceId}/play`, { visitorId });
}

export async function getLotteryWinners(workspaceId: number | string) {
  return api.get<{ data: LotteryWinner[] }>(`/public/lottery/${workspaceId}/winners`);
}
