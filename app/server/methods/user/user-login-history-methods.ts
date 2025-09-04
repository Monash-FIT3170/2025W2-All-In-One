import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { LoginHistoryCollection } from "/app/server/database/user/user-collections";
import { ApiLoginHistoryPage } from "/app/shared/api-models/user/ApiLoginHistory";

type InsertPayload = {
  userId: string;
  loginAt?: Date;
  timezone: string;
};

type GetForUserPayload = {
  userId: string;
  page?: number;
  pageSize?: number;
};

Meteor.methods({
  [MeteorMethodIdentifier.LOGIN_HISTORY_INSERT]: async (data: InsertPayload) => {
    const { userId, loginAt = new Date(), timezone } = data;
    if (!userId) throw new Meteor.Error("bad-request", "userId is required");
    if (!timezone) throw new Meteor.Error("bad-request", "timezone is required");

    return await LoginHistoryCollection.insertAsync({
      userId,
      loginAt,
      timezone,
    } as any);
  },

  [MeteorMethodIdentifier.LOGIN_HISTORY_GET_FOR_USER]: async (
    data: GetForUserPayload
  ) => {
    const { userId, page = 1, pageSize = 10 } = data;
    if (!userId) throw new Meteor.Error("bad-request", "userId is required");
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      LoginHistoryCollection.find(
        { userId },
        { sort: { loginAt: -1 }, skip, limit: pageSize }
      ).fetchAsync(),
      LoginHistoryCollection.find({ userId }).countAsync(),
    ]);

    const mapped = items.map((x: any) => ({
      loginAt: (x.loginAt as Date)?.toISOString?.() ?? new Date().toISOString(),
      timezone: x.timezone,
    }));

    const result: ApiLoginHistoryPage = {
      items: mapped,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
    return result;
  },
});


