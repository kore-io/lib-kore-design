import { RuleTester } from 'eslint';
import { afterAll, describe, expect, it } from 'vitest';
import kore from '../eslint/index.js';
import { findNonSemanticClasses } from '../eslint/rules.js';

// O RuleTester usa os globais do Mocha; aqui, os do Vitest.
Object.assign(RuleTester, { afterAll });
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
  languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
});

const rule = kore.rules['semantic-class-names'];

describe('classes semânticas (decisões 131 e 148)', () => {
  it('aceita só BEM com o prefixo kore-', () => {
    expect(
      findNonSemanticClasses({
        classes:
          'kore-button kore-button--primary kore-sign-in__form kore-field-box--invalid flex p-4 Kore-x kore- kore-a__b__c bg-[#f00]',
      }),
    ).toEqual(['flex', 'p-4', 'Kore-x', 'kore-', 'kore-a__b__c', 'bg-[#f00]']);
  });
});

ruleTester.run('kore/semantic-class-names', rule, {
  valid: [
    { code: '<div className="kore-sign-in kore-sign-in__form" />' },
    { code: '<div className={`kore-button--${variant}`} />' },
    { code: '<div className={`kore-card ${className}`} />' },
    { code: '<div className={open && "kore-drawer--open"} />' },
    { code: '<div className={a ? "kore-x--a" : "kore-x--b"} />' },
    { code: '<div className={names} />' },
    {
      code: "joinClassNames({ names: ['kore-button', `kore-button--${size}`, invalid && 'kore-x--invalid', className] })",
    },
    { code: '<div id="flex" />' },
    { code: "const cls = 'kore-card'; const el = <div className={cls} />;" },
    { code: "let cls = 'flex'; cls = x; const el = <div className={cls} />;" },
    { code: 'function F({ className }) { return <div className={className} />; }' },
    { code: "const el = <div className={clsx('kore-card', open && 'kore-card--open')} />;" },
  ],
  invalid: [
    {
      code: "const cls = 'flex'; const el = <div className={cls} />;",
      errors: [{ messageId: 'rejected', data: { name: 'flex' } }],
    },
    {
      code: "const el = <div className={clsx('kore-card', 'bg-red-500')} />;",
      errors: [{ messageId: 'rejected', data: { name: 'bg-red-500' } }],
    },
    {
      code: "const el = <div className={`kore-card ${'mt-2'}`} />;",
      errors: [{ messageId: 'rejected', data: { name: 'mt-2' } }],
    },
    {
      code: "const el = <div className={`kore-card ${open ? 'kore-card--open' : 'hidden'}`} />;",
      errors: [{ messageId: 'rejected', data: { name: 'hidden' } }],
    },
    {
      code: '<div className="flex p-4" />',
      errors: [{ messageId: 'rejected' }, { messageId: 'rejected' }],
    },
    {
      code: '<div className={`kore-card ${x} mt-2`} />',
      errors: [{ messageId: 'rejected', data: { name: 'mt-2' } }],
    },
    {
      code: '<div className={`bg-${tone}`} />',
      errors: [{ messageId: 'rejected', data: { name: 'bg-${…}' } }],
    },
    {
      code: '<div className={open ? "kore-a" : "hidden"} />',
      errors: [{ messageId: 'rejected', data: { name: 'hidden' } }],
    },
    {
      code: "joinClassNames({ names: ['kore-button', 'shadow-md'] })",
      errors: [{ messageId: 'rejected', data: { name: 'shadow-md' } }],
    },
  ],
});
