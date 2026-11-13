import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type EmbossedButtonBaseProps = {
  className?: string;
  tone?: "blue" | "white";
};

type EmbossedButtonAsButton = EmbossedButtonBaseProps &
  Omit<React.ComponentProps<"button">, "className"> & { href?: undefined };

type EmbossedButtonAsLink = EmbossedButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, "className"> & { href: string };

export type EmbossedButtonProps = EmbossedButtonAsButton | EmbossedButtonAsLink;

const baseClasses =
  "inline-flex min-h-9.5 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3.75 py-2.5 text-sm font-[650] whitespace-nowrap transition-[background,box-shadow,scale,transform] duration-150 ease-out motion-safe:active:scale-95 motion-reduce:transition-none disabled:active:scale-100 disabled:cursor-not-allowed disabled:opacity-48";

const toneClasses = {
  blue: "bg-[linear-gradient(180deg,#3b82f6_0%,#1d4ed8_100%)] text-white shadow-[inset_0_2px_0_rgba(147,197,253,0.55),inset_0_-2px_0_rgba(35,68,200)] hover:bg-[linear-gradient(180deg,#4b8df8_0%,#2563eb_100%)] hover:shadow-[inset_0_2px_0_rgba(147,197,253,0.3),inset_0_-2px_0_rgba(35,68,200,0.6)] dark:bg-[linear-gradient(180deg,#3b82f6_0%,#1e40af_100%)] dark:text-[#f5f5f5] dark:shadow-[inset_0_2px_0_rgba(147,197,253,0.45),inset_0_-2px_0_rgba(35,68,200,0.95)] dark:hover:bg-[linear-gradient(180deg,#4b8df8_0%,#1d4ed8_100%)] dark:hover:shadow-[inset_0_2px_0_rgba(191,219,254,0.55),inset_0_-2px_0_rgba(35,68,200,1)]",
  white:
    "bg-[linear-gradient(180deg,#ffffff_0%,#e8e8e8_100%)] text-[#171717] shadow-[inset_0_2px_0_#ffffff,inset_0_-2px_0_#cfcfcf] hover:bg-[linear-gradient(180deg,#ffffff_0%,#f1f1f1_100%)] hover:shadow-[inset_0_2px_0_#ffffff,inset_0_-2px_0_#dedede]",
};

export function EmbossedButton({ className, tone = "blue", ...props }: EmbossedButtonProps) {
  const classes = cn(baseClasses, toneClasses[tone], className);
  if (props.href !== undefined) {
    const { href, ...rest } = props;
    return <Link className={classes} href={href} {...rest} />;
  }
  const { type = "button", ...rest } = props;
  return <button className={classes} type={type} {...rest} />;
}
