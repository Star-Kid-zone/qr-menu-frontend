"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PiCheckCircleBold, PiClockBold, PiCopyBold, PiTrashBold } from "react-icons/pi";
import { Button, FormField, Input, Spinner, toast } from "@/components/ui";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { workspaceService, type SiteDomain } from "@/services/workspace.service";
import { getApiErrorMessage } from "@/utils/errors";
import { getTenantPublicUrl } from "@/config/app.constants";

function CopyValue({ label, value }: { label: string; value: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied.`);
    } catch {
      toast.error("Couldn't copy. Select the text and copy it instead.");
    }
  };
  return (
    <div className="flex min-w-0 items-center gap-2">
      <code className="min-w-0 flex-1 truncate rounded bg-muted px-2 py-1 text-caption text-foreground" title={value}>
        {value}
      </code>
      <button
        type="button"
        onClick={() => void copy()}
        aria-label={`Copy ${label}`}
        className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <PiCopyBold className="size-4" />
      </button>
    </div>
  );
}

function DomainRow({ domain, onChanged }: { domain: SiteDomain; onChanged: () => void }) {
  const [checking, setChecking] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const { confirm, confirmDialog } = useConfirmDialog();

  const verify = async () => {
    setChecking(true);
    setReason(null);
    try {
      const res = await workspaceService.verifyDomain(domain.id);
      if (res.data.domain.verified) {
        toast.success(`${domain.domain} is connected.`);
        onChanged();
      } else {
        setReason(res.data.reason);
      }
    } catch (err) {
      setReason(getApiErrorMessage(err, "Couldn't check the domain right now."));
    } finally {
      setChecking(false);
    }
  };

  const remove = async () => {
    const ok = await confirm({
      title: `Remove ${domain.domain}?`,
      description: domain.verified
        ? "Guests visiting this domain will see a 'not set up' page. Your free address keeps working."
        : "You can add it again later.",
      confirmLabel: "Remove",
      tone: "destructive",
    });
    if (!ok) return;
    try {
      await workspaceService.removeDomain(domain.id);
      toast.success("Domain removed.");
      onChanged();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't remove the domain."));
    }
  };

  const isApex = domain.domain.split(".").length === 2;

  return (
    <li className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-body-medium text-foreground">{domain.domain}</p>
          {domain.verified ? (
            <p className="flex items-center gap-1 text-caption text-success">
              <PiCheckCircleBold className="size-4" aria-hidden /> Connected
            </p>
          ) : (
            <p className="flex items-center gap-1 text-caption text-muted-foreground">
              <PiClockBold className="size-4" aria-hidden /> Waiting for DNS
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {domain.verified ? null : (
            <Button type="button" size="sm" loading={checking} onClick={() => void verify()}>
              Check now
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void remove()}
            aria-label={`Remove ${domain.domain}`}
            startIcon={<PiTrashBold className="size-4" />}
          >
            Remove
          </Button>
        </div>
      </div>

      {reason ? (
        <p role="status" className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-caption text-foreground">
          {reason}
        </p>
      ) : null}

      {domain.verified ? null : (
        <div className="space-y-3 text-caption text-muted-foreground">
          <p>At the company where you bought the domain, open its DNS settings and add:</p>
          <dl className="grid gap-2 sm:grid-cols-[auto_1fr_1fr] sm:items-center">
            <dt className="font-semibold text-foreground">1. TXT record</dt>
            <dd>
              <CopyValue label="TXT name" value={domain.dns.txt.name} />
            </dd>
            <dd>
              <CopyValue label="TXT value" value={domain.dns.txt.value} />
            </dd>
            {domain.dns.cname ? (
              <>
                <dt className="font-semibold text-foreground">2. CNAME record</dt>
                <dd>
                  <CopyValue label="CNAME name" value={domain.dns.cname.name} />
                </dd>
                <dd>
                  <CopyValue label="CNAME target" value={domain.dns.cname.target} />
                </dd>
              </>
            ) : null}
          </dl>
          {isApex ? (
            <p>
              Your domain has no &ldquo;www&rdquo;. Many DNS providers don&apos;t allow a CNAME there — use an ALIAS/ANAME record if
              offered, or connect <strong className="text-foreground">www.{domain.domain}</strong> instead.
            </p>
          ) : null}
          <p>DNS changes usually show up within minutes, but can take up to an hour.</p>
        </div>
      )}
      {confirmDialog}
    </li>
  );
}

/**
 * Settings → Website address: the free subdomain, plus custom domains the
 * owner connects by adding DNS records and verifying them.
 */
export function CustomDomainsCard({ publicSlug }: { publicSlug: string | null | undefined }) {
  const [domains, setDomains] = useState<SiteDomain[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    workspaceService
      .listDomains()
      .then((res) => {
        if (!cancelled) {
          setDomains(res.data);
          setLoadError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(getApiErrorMessage(err, "Couldn't load your domains."));
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setAdding(true);
    setAddError(null);
    try {
      await workspaceService.addDomain(input.trim());
      setInput("");
      reload();
    } catch (err) {
      setAddError(getApiErrorMessage(err, "Couldn't add that domain."));
    } finally {
      setAdding(false);
    }
  };

  return (
    <section aria-labelledby="domains-heading" className="space-y-5 rounded-lg border border-border bg-card p-4 md:p-6">
      <div>
        <h2 id="domains-heading" className="text-h3 text-foreground">
          Website address
        </h2>
        <p className="mt-1 text-caption text-muted-foreground">
          Your free address is{" "}
          <a href={getTenantPublicUrl(publicSlug)} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
            {getTenantPublicUrl(publicSlug).replace(/^https:\/\//, "")}
          </a>
          . You can also use a domain you own, like www.yourrestaurant.com.
        </p>
      </div>

      <form onSubmit={(e) => void add(e)} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <FormField label="Your domain" htmlFor="custom-domain" error={addError ?? undefined} className="sm:flex-1">
          <Input
            id="custom-domain"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="www.yourrestaurant.com"
            autoComplete="off"
            spellCheck={false}
            disabled={adding}
          />
        </FormField>
        <Button type="submit" loading={adding} disabled={!input.trim()}>
          Add domain
        </Button>
      </form>

      {loadError ? (
        <div role="alert" className="space-y-2">
          <p className="text-body text-destructive">{loadError}</p>
          <Button type="button" variant="secondary" size="sm" onClick={reload}>
            Try again
          </Button>
        </div>
      ) : domains === null ? (
        <div className="flex justify-center py-6" aria-busy="true">
          <Spinner size="md" />
        </div>
      ) : domains.length ? (
        <ul aria-label="Your domains" className="space-y-3">
          {domains.map((d) => (
            <DomainRow key={d.id} domain={d} onChanged={reload} />
          ))}
        </ul>
      ) : null}
    </section>
  );
}
