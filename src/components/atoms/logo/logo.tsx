import type { ComponentPropsWithRef } from 'react';
import { joinClassNames } from '../../../lib/class-names';

/** Versões do DS (Logo Kore): Vinho, para fundo claro, e Branco, para fundo escuro. */
export type LogoVariant = 'wine' | 'white';

export interface LogoProps extends Omit<ComponentPropsWithRef<'svg'>, 'children'> {
  variant?: LogoVariant;
  /** Nome acessível, vindo do app. */
  label: string;
}

/**
 * Logo do Kore (símbolo e wordmark), com a geometria exata do DS (86,4 x 32). As cores
 * vêm do CSS (tokens), conforme a versão.
 */
export function Logo({ variant = 'wine', label, className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="64 4290 86.4 32"
      role="img"
      aria-label={label}
      className={joinClassNames({ names: ['kore-logo', `kore-logo--${variant}`, className] })}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      {...props}
    >
      <circle className="kore-logo__symbol" cx="80" cy="4306" r="14.4" />
      <g className="kore-logo__mark" strokeWidth="3.84">
        <path d="M72.96082305908203,4297.359375L72.96082305908203,4314.640625" />
        <path d="M87.35926055908203,4297.359375L81.92176055908203,4306L87.35926055908203,4314.640625" />
      </g>
      <circle className="kore-logo__dot" cx="77.76" cy="4306" r="1.44" />
      <g className="kore-logo__wordmark" strokeWidth="2.24">
        <path d="M103.99988555908203,4299.28125L103.99988555908203,4314.3203125" />
        <path d="M111.35926055908203,4305.0390625L107.19910430908203,4309.51953125L111.35926055908203,4314" />
        {/* No Penpot o traço do "o" é interno (raio 4,64); centrado, o raio fica 3,52. */}
        <circle cx="118.4" cy="4309.52" r="3.52" />
        <path d="M127.67957305908203,4314.3203125L127.67957305908203,4304.87890625M127.67957305908203,4307.921875C127.67957305908203,4306,129.6014404296875,4304.87890625,132.1600341796875,4304.87890625" />
        <path d="M135.0389404296875,4309.51953125L144.3201904296875,4309.51953125C144.3201904296875,4306.9609375,142.3983154296875,4304.87890625,139.6795654296875,4304.87890625C136.9608154296875,4304.87890625,135.0389404296875,4306.9609375,135.0389404296875,4309.51953125C135.0389404296875,4312.23828125,137.1209716796875,4314.16015625,139.6795654296875,4314.16015625C141.7615966796875,4314.16015625,143.1990966796875,4313.359375,143.9998779296875,4312.078125" />
      </g>
    </svg>
  );
}
