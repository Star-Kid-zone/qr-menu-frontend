"use client";

import React from "react";
import { Card, Badge, EmptyState } from "@/components/ui";
import { PiUsersBold } from "react-icons/pi";
import type { UserDetailResponse } from "../types";

interface UserStaffTabProps {
  detail: UserDetailResponse;
}

export function UserStaffTab({ detail }: UserStaffTabProps) {
  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PiUsersBold className="size-5" />
          </div>
          <div>
            <h2 className="text-h3 font-bold text-foreground">
              Delegated Staff & Operators
            </h2>
            <p className="text-xs text-muted-foreground">
              Sub-accounts granted access to this restaurant&apos;s admin portal
            </p>
          </div>
        </div>
        <Badge tone={detail.staff.length > 0 ? "success" : "neutral"}>
          {detail.staff.length} Members
        </Badge>
      </div>

      {detail.staff.length === 0 ? (
        <EmptyState
          icon={<PiUsersBold className="size-8" />}
          title="No Sub-Users Created"
          description="This tenant has not added any staff or manager logins."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {detail.staff.map((member) => (
            <Card key={member.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted font-bold text-foreground">
                    {member.name ? member.name.charAt(0).toUpperCase() : "S"}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{member.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      {member.phone}
                    </p>
                  </div>
                </div>
                <Badge tone={member.active ? "success" : "neutral"}>
                  {member.active ? "Active" : "Disabled"}
                </Badge>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="rounded-md bg-accent px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                  {member.role}
                </span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  Joined {new Date(member.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
