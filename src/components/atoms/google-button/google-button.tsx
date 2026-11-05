import { joinClassNames } from '../../../lib/class-names';
import { Button, type ButtonProps } from '../button/button';
import { GoogleLogo } from './google-logo';

/** O texto vem do app (Voz e Penpot: "Continuar com Google"). */
export type GoogleButtonProps = Omit<ButtonProps, 'variant' | 'size'>;

/** Google Button do DS: um Button secundário G com o logo do Google. */
export function GoogleButton({ className, children, ...props }: GoogleButtonProps) {
  return (
    <Button
      variant="secondary"
      size="lg"
      className={joinClassNames({ names: ['kore-google-button', className] })}
      {...props}
    >
      <GoogleLogo />
      {children}
    </Button>
  );
}
