// Plugin do Stylelint com as regras do CSS de componente (decisões 131 e 133).
// Uso: plugins: ['@kore-io/design/stylelint'], rules: { 'kore/apply-ds-only': true,
// 'kore/declaration-ds-only': true, 'kore/at-rule-ds-only': true }.
import stylelint from 'stylelint';
import { findApplyViolations, findAtRuleViolation, findDeclarationViolation } from './rules.js';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const applyRule = 'kore/apply-ds-only';
const applyMessages = ruleMessages(applyRule, {
  rejected: (candidate) => `@apply fora do DS: "${candidate}" (decisão 131)`,
});

/** @type {import('stylelint').Rule} */
const applyDsOnly = (primary) => (root, result) => {
  if (!validateOptions(result, applyRule, { actual: primary, possible: [true] })) return;
  root.walkAtRules('apply', (atRule) => {
    for (const candidate of findApplyViolations({ params: atRule.params })) {
      report({
        ruleName: applyRule,
        result,
        node: atRule,
        word: candidate,
        message: applyMessages.rejected(candidate),
      });
    }
  });
};
applyDsOnly.ruleName = applyRule;
applyDsOnly.messages = applyMessages;

const declarationRule = 'kore/declaration-ds-only';
const declarationMessages = ruleMessages(declarationRule, {
  rejected: (reason) => `Declaração fora do DS: ${reason} (decisão 133)`,
});

/** @type {import('stylelint').Rule} */
const declarationDsOnly = (primary) => (root, result) => {
  if (!validateOptions(result, declarationRule, { actual: primary, possible: [true] })) return;
  root.walkDecls((declaration) => {
    const reason = findDeclarationViolation({
      property: declaration.prop,
      value: declaration.value,
    });
    if (reason) {
      report({
        ruleName: declarationRule,
        result,
        node: declaration,
        message: declarationMessages.rejected(reason),
      });
    }
  });
};
declarationDsOnly.ruleName = declarationRule;
declarationDsOnly.messages = declarationMessages;

const atRuleRule = 'kore/at-rule-ds-only';
const atRuleMessages = ruleMessages(atRuleRule, {
  rejected: (reason) => `At-rule fora do DS: ${reason} (decisão 133)`,
});

/** @type {import('stylelint').Rule} */
const atRuleDsOnly = (primary) => (root, result) => {
  if (!validateOptions(result, atRuleRule, { actual: primary, possible: [true] })) return;
  root.walkAtRules((atRule) => {
    const reason = findAtRuleViolation({ name: atRule.name });
    if (reason) {
      report({
        ruleName: atRuleRule,
        result,
        node: atRule,
        message: atRuleMessages.rejected(reason),
      });
    }
  });
};
atRuleDsOnly.ruleName = atRuleRule;
atRuleDsOnly.messages = atRuleMessages;

export default [
  createPlugin(applyRule, applyDsOnly),
  createPlugin(declarationRule, declarationDsOnly),
  createPlugin(atRuleRule, atRuleDsOnly),
];
