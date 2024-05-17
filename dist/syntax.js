"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalVariableDecl = exports.optionallyTypedIdent = exports.variableDecl = exports.variableOrValueStatement = exports.templateElaboratedIdent = exports.typeSpecifier = exports.typeAliasDecl = exports.structMember = exports.structBodyDecl = exports.structDecl = exports.diagnosticControl = exports.attribute = exports.computeAttr = exports.fragmentAttr = exports.vertexAttr = exports.workgroupSizeAttr = exports.sizeAttr = exports.mustUseAttr = exports.locationAttr = exports.invariantAttr = exports.interpolateSamplingName = exports.interpolateTypeName = exports.interpolateAttr = exports.idAttr = exports.groupAttr = exports.diagnosticAttr = exports.constAttr = exports.builtinValueName = exports.builtinAttr = exports.bindingAttr = exports.alignAttr = exports.templateArgExpression = exports.templateArgCommaList = exports.templateList = exports.diagnosticRuleName = exports.diagnosticNameToken = exports.memberIdent = exports.ident = exports.literal = exports.diagnosticDirective = exports.hexFloatLiteral = exports.decimalFloatLiteral = exports.floatLiteral = exports.hexIntLiteral = exports.decimalIntLiteral = exports.intLiteral = exports.boolLiteral = exports.globalDecl = exports.globalDirective = exports.translationUnit = void 0;
exports.continueStatement = exports.breakIfStatement = exports.breakStatement = exports.whileStatement = exports.forUpdate = exports.forInit = exports.forHeader = exports.forStatement = exports.loopStatement = exports.caseSelector = exports.caseSelectors = exports.defaultAloneClause = exports.caseClause = exports.switchClause = exports.switchBody = exports.switchStatement = exports.elseClause = exports.elseIfClause = exports.ifClause = exports.ifStatement = exports.decrementStatement = exports.incrementStatement = exports.compoundAssignmentOperator = exports.assignmentStatement = exports.compoundStatement = exports.expression = exports.bitwiseExpression = exports.binaryXorExpression = exports.binaryAndExpression = exports.binaryOrExpression = exports.shortCircuitOrExpression = exports.shortCircuitAndExpression = exports.relationalExpression = exports.shiftExpression = exports.additiveOperator = exports.additiveExpression = exports.multiplicativeOperator = exports.multiplicativeExpression = exports.coreLhsExpression = exports.lhsExpression = exports.singularExpression = exports.unaryExpression = exports.componentOrSwizzleSpecifier = exports.expressionCommaList = exports.argumentExpressionList = exports.parenExpression = exports.callPhrase = exports.callExpression = exports.primaryExpression = exports.globalValueDecl = void 0;
exports.includePath = exports.includeDirective = exports.globalDirectiveExtended = exports.translationUnitExtended = exports.swizzleName = exports.severityControlName = exports.identPatternToken = exports.softwareExtensionName = exports.enableExtensionName = exports.softwareExtensionList = exports.requiresDirective = exports.enableExtensionList = exports.enableDirective = exports.param = exports.paramList = exports.functionHeader = exports.functionDecl = exports.variableUpdatingStatement = exports.statement = exports.constAssertStatement = exports.funcCallStatement = exports.returnStatement = exports.continuingCompoundStatement = exports.continuingStatement = void 0;
const rules_1 = require("./rules");
const TEMPLATE_ARGS_START = '❬';
const TEMPLATE_ARGS_END = '❭';
const SHIFT_LEFT = '<<';
const SHIFT_RIGHT = '>>';
const LESS_THAN = '<';
const GREATER_THAN = '>';
const LESS_THAN_EQUAL = '<=';
const GREATER_THAN_EQUAL = '>=';
const SHIFT_LEFT_ASSIGN = '<<=';
const SHIFT_RIGHT_ASSIGN = '>>=';
exports.translationUnit = (0, rules_1.symbol)('translation_unit');
exports.globalDirective = (0, rules_1.symbol)('global_directive');
exports.globalDecl = (0, rules_1.symbol)('global_decl');
exports.boolLiteral = (0, rules_1.symbol)('bool_literal');
exports.intLiteral = (0, rules_1.symbol)('int_literal');
exports.decimalIntLiteral = (0, rules_1.symbol)('decimal_int_literal');
exports.hexIntLiteral = (0, rules_1.symbol)('hex_int_literal');
exports.floatLiteral = (0, rules_1.symbol)('float_literal');
exports.decimalFloatLiteral = (0, rules_1.symbol)('decimal_float_literal');
exports.hexFloatLiteral = (0, rules_1.symbol)('hex_float_literal');
exports.diagnosticDirective = (0, rules_1.symbol)('diagnostic_directive');
exports.literal = (0, rules_1.symbol)('literal');
exports.ident = (0, rules_1.symbol)('ident');
exports.memberIdent = (0, rules_1.symbol)('member_ident');
exports.diagnosticNameToken = (0, rules_1.symbol)('diagnostic_name_token');
exports.diagnosticRuleName = (0, rules_1.symbol)('diagnostic_rule_name');
exports.templateList = (0, rules_1.symbol)('template_list');
exports.templateArgCommaList = (0, rules_1.symbol)('template_arg_comma_list');
exports.templateArgExpression = (0, rules_1.symbol)('template_arg_expression');
exports.alignAttr = (0, rules_1.symbol)('align_attr');
exports.bindingAttr = (0, rules_1.symbol)('binding_attr');
exports.builtinAttr = (0, rules_1.symbol)('builtin_attr');
exports.builtinValueName = (0, rules_1.symbol)('builtin_value_name');
exports.constAttr = (0, rules_1.symbol)('const_attr');
exports.diagnosticAttr = (0, rules_1.symbol)('diagnostic_attr');
exports.groupAttr = (0, rules_1.symbol)('group_attr');
exports.idAttr = (0, rules_1.symbol)('id_attr');
exports.interpolateAttr = (0, rules_1.symbol)('interpolate_attr');
exports.interpolateTypeName = (0, rules_1.symbol)('interpolate_type_name');
exports.interpolateSamplingName = (0, rules_1.symbol)('interpolate_sampling_name');
exports.invariantAttr = (0, rules_1.symbol)('invariant_attr');
exports.locationAttr = (0, rules_1.symbol)('location_attr');
exports.mustUseAttr = (0, rules_1.symbol)('must_use_attr');
exports.sizeAttr = (0, rules_1.symbol)('size_attr');
exports.workgroupSizeAttr = (0, rules_1.symbol)('workgroup_size_attr');
exports.vertexAttr = (0, rules_1.symbol)('vertex_attr');
exports.fragmentAttr = (0, rules_1.symbol)('fragment_attr');
exports.computeAttr = (0, rules_1.symbol)('compute_attr');
exports.attribute = (0, rules_1.symbol)('attribute');
exports.diagnosticControl = (0, rules_1.symbol)('diagnostic_control');
exports.structDecl = (0, rules_1.symbol)('struct_decl');
exports.structBodyDecl = (0, rules_1.symbol)('struct_body_decl');
exports.structMember = (0, rules_1.symbol)('struct_member');
exports.typeAliasDecl = (0, rules_1.symbol)('type_alias_decl');
exports.typeSpecifier = (0, rules_1.symbol)('type_specifier');
exports.templateElaboratedIdent = (0, rules_1.symbol)('template_elaborated_ident');
exports.variableOrValueStatement = (0, rules_1.symbol)('variable_or_value_statement');
exports.variableDecl = (0, rules_1.symbol)('variable_decl');
exports.optionallyTypedIdent = (0, rules_1.symbol)('optionally_typed_ident');
exports.globalVariableDecl = (0, rules_1.symbol)('global_variable_decl');
exports.globalValueDecl = (0, rules_1.symbol)('global_value_decl');
exports.primaryExpression = (0, rules_1.symbol)('primary_expression');
exports.callExpression = (0, rules_1.symbol)('call_expression');
exports.callPhrase = (0, rules_1.symbol)('call_phrase');
exports.parenExpression = (0, rules_1.symbol)('paren_expression');
exports.argumentExpressionList = (0, rules_1.symbol)('argument_expression_list');
exports.expressionCommaList = (0, rules_1.symbol)('expression_comma_list');
exports.componentOrSwizzleSpecifier = (0, rules_1.symbol)('component_or_swizzle_specifier');
exports.unaryExpression = (0, rules_1.symbol)('unary_expression');
exports.singularExpression = (0, rules_1.symbol)('singular_expression');
exports.lhsExpression = (0, rules_1.symbol)('lhs_expression');
exports.coreLhsExpression = (0, rules_1.symbol)('core_lhs_expression');
exports.multiplicativeExpression = (0, rules_1.symbol)('multiplicative_expression');
exports.multiplicativeOperator = (0, rules_1.symbol)('multiplicative_operator');
exports.additiveExpression = (0, rules_1.symbol)('additive_expression');
exports.additiveOperator = (0, rules_1.symbol)('additive_operator');
exports.shiftExpression = (0, rules_1.symbol)('shift_expression');
exports.relationalExpression = (0, rules_1.symbol)('relational_expression');
exports.shortCircuitAndExpression = (0, rules_1.symbol)('short_circuit_and_expression');
exports.shortCircuitOrExpression = (0, rules_1.symbol)('short_circuit_or_expression');
exports.binaryOrExpression = (0, rules_1.symbol)('binary_or_expression');
exports.binaryAndExpression = (0, rules_1.symbol)('binary_and_expression');
exports.binaryXorExpression = (0, rules_1.symbol)('binary_xor_expression');
exports.bitwiseExpression = (0, rules_1.symbol)('bitwise_expression');
exports.expression = (0, rules_1.symbol)('expression');
exports.compoundStatement = (0, rules_1.symbol)('compound_statement');
exports.assignmentStatement = (0, rules_1.symbol)('assignment_statement');
exports.compoundAssignmentOperator = (0, rules_1.symbol)('compound_assignment_operator');
exports.incrementStatement = (0, rules_1.symbol)('increment_statement');
exports.decrementStatement = (0, rules_1.symbol)('decrement_statement');
exports.ifStatement = (0, rules_1.symbol)('if_statement');
exports.ifClause = (0, rules_1.symbol)('if_clause');
exports.elseIfClause = (0, rules_1.symbol)('else_if_clause');
exports.elseClause = (0, rules_1.symbol)('else_clause');
exports.switchStatement = (0, rules_1.symbol)('switch_statement');
exports.switchBody = (0, rules_1.symbol)('switch_body');
exports.switchClause = (0, rules_1.symbol)('switch_clause');
exports.caseClause = (0, rules_1.symbol)('case_clause');
exports.defaultAloneClause = (0, rules_1.symbol)('default_alone_clause');
exports.caseSelectors = (0, rules_1.symbol)('case_selectors');
exports.caseSelector = (0, rules_1.symbol)('case_selector');
exports.loopStatement = (0, rules_1.symbol)('loop_statement');
exports.forStatement = (0, rules_1.symbol)('for_statement');
exports.forHeader = (0, rules_1.symbol)('for_header');
exports.forInit = (0, rules_1.symbol)('for_init');
exports.forUpdate = (0, rules_1.symbol)('for_update');
exports.whileStatement = (0, rules_1.symbol)('while_statement');
exports.breakStatement = (0, rules_1.symbol)('break_statement');
exports.breakIfStatement = (0, rules_1.symbol)('break_if_statement');
exports.continueStatement = (0, rules_1.symbol)('continue_statement');
exports.continuingStatement = (0, rules_1.symbol)('continuing_statement');
exports.continuingCompoundStatement = (0, rules_1.symbol)('continuing_compound_statement');
exports.returnStatement = (0, rules_1.symbol)('return_statement');
exports.funcCallStatement = (0, rules_1.symbol)('func_call_statement');
exports.constAssertStatement = (0, rules_1.symbol)('const_assert_statement');
exports.statement = (0, rules_1.symbol)('statement');
exports.variableUpdatingStatement = (0, rules_1.symbol)('variable_updating_statement');
exports.functionDecl = (0, rules_1.symbol)('function_decl');
exports.functionHeader = (0, rules_1.symbol)('function_header');
exports.paramList = (0, rules_1.symbol)('param_list');
exports.param = (0, rules_1.symbol)('param');
exports.enableDirective = (0, rules_1.symbol)('enable_directive');
exports.enableExtensionList = (0, rules_1.symbol)('enable_extension_list');
exports.requiresDirective = (0, rules_1.symbol)('requires_directive');
exports.softwareExtensionList = (0, rules_1.symbol)('software_extension_list');
exports.enableExtensionName = (0, rules_1.symbol)('enable_extension_name');
exports.softwareExtensionName = (0, rules_1.symbol)('software_extension_name');
exports.identPatternToken = (0, rules_1.symbol)('ident_pattern_token');
exports.severityControlName = (0, rules_1.symbol)('severity_control_name');
exports.swizzleName = (0, rules_1.symbol)('swizzle_name');
exports.translationUnit.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.globalDirective), (0, rules_1.star)(exports.globalDecl))));
exports.globalDirective.set((0, rules_1.union)(exports.diagnosticDirective, exports.enableDirective, exports.requiresDirective));
exports.globalDecl.set((0, rules_1.union)(';', (0, rules_1.sequence)(exports.globalVariableDecl, ';'), (0, rules_1.sequence)(exports.globalValueDecl, ';'), (0, rules_1.sequence)(exports.typeAliasDecl, ';'), exports.structDecl, exports.functionDecl, (0, rules_1.sequence)(exports.constAssertStatement, ';')));
exports.boolLiteral.set((0, rules_1.union)('true', 'false'));
exports.intLiteral.set((0, rules_1.union)(exports.decimalIntLiteral, exports.hexIntLiteral));
exports.decimalIntLiteral.set((0, rules_1.union)(/0[iu]?/, /[1-9][0-9]*[iu]?/));
exports.hexIntLiteral.set((0, rules_1.union)(/0[xX][0-9a-fA-F]+[iu]?/));
exports.floatLiteral.set((0, rules_1.union)(exports.decimalFloatLiteral, exports.hexFloatLiteral));
exports.decimalFloatLiteral.set((0, rules_1.union)(/0[fh]/, /[1-9][0-9]*[fh]/, /[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?[fh]?/, /[0-9]+\.[0-9]*([eE][+-]?[0-9]+)?[fh]?/, /[0-9]+[eE][+-]?[0-9]+[fh]?/));
exports.hexFloatLiteral.set((0, rules_1.union)(/0[xX][0-9a-fA-F]*\.[0-9a-fA-F]+([pP][+-]?[0-9]+[fh]?)?/, /0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*([pP][+-]?[0-9]+[fh]?)?/, /0[xX][0-9a-fA-F]+[pP][+-]?[0-9]+[fh]?/));
exports.diagnosticDirective.set((0, rules_1.union)((0, rules_1.sequence)('diagnostic', exports.diagnosticControl, ';')));
exports.literal.set((0, rules_1.union)(exports.intLiteral, exports.floatLiteral, exports.boolLiteral));
exports.ident.set((0, rules_1.union)(exports.identPatternToken));
exports.memberIdent.set((0, rules_1.union)(exports.identPatternToken));
exports.diagnosticNameToken.set((0, rules_1.union)(exports.identPatternToken));
exports.diagnosticRuleName.set((0, rules_1.union)(exports.diagnosticNameToken, (0, rules_1.sequence)(exports.diagnosticNameToken, '.', exports.diagnosticNameToken)));
exports.templateList.set((0, rules_1.union)((0, rules_1.sequence)(TEMPLATE_ARGS_START, exports.templateArgCommaList, TEMPLATE_ARGS_END)));
exports.templateArgCommaList.set((0, rules_1.union)((0, rules_1.sequence)(exports.templateArgExpression, (0, rules_1.star)((0, rules_1.sequence)(',', exports.templateArgExpression)), (0, rules_1.maybe)(','))));
exports.templateArgExpression.set((0, rules_1.union)(exports.expression));
exports.alignAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'align', '(', exports.expression, (0, rules_1.maybe)(','), ')')));
exports.bindingAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'binding', '(', exports.expression, (0, rules_1.maybe)(','), ')')));
exports.builtinAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'builtin', '(', exports.builtinValueName, (0, rules_1.maybe)(','), ')')));
exports.builtinValueName.set((0, rules_1.union)(exports.identPatternToken));
exports.constAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'const')));
exports.diagnosticAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'diagnostic', exports.diagnosticControl)));
exports.groupAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'group', '(', exports.expression, (0, rules_1.maybe)(','), ')')));
exports.idAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'id', '(', exports.expression, (0, rules_1.maybe)(','), ')')));
exports.interpolateAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'interpolate', '(', exports.interpolateTypeName, (0, rules_1.maybe)(','), ')'), (0, rules_1.sequence)('@', 'interpolate', '(', exports.interpolateTypeName, ',', exports.interpolateSamplingName, (0, rules_1.maybe)(','), ')')));
exports.interpolateTypeName.set((0, rules_1.union)(exports.identPatternToken));
exports.interpolateSamplingName.set((0, rules_1.union)(exports.identPatternToken));
exports.invariantAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'invariant')));
exports.locationAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'location', '(', exports.expression, (0, rules_1.maybe)(','), ')')));
exports.mustUseAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'must_use')));
exports.sizeAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'size', '(', exports.expression, (0, rules_1.maybe)(','), ')')));
exports.workgroupSizeAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'workgroup_size', '(', exports.expression, (0, rules_1.maybe)(','), ')'), (0, rules_1.sequence)('@', 'workgroup_size', '(', exports.expression, ',', exports.expression, (0, rules_1.maybe)(','), ')'), (0, rules_1.sequence)('@', 'workgroup_size', '(', exports.expression, ',', exports.expression, ',', exports.expression, (0, rules_1.maybe)(','), ')')));
exports.vertexAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'vertex')));
exports.fragmentAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'fragment')));
exports.computeAttr.set((0, rules_1.union)((0, rules_1.sequence)('@', 'compute')));
exports.attribute.set((0, rules_1.union)((0, rules_1.sequence)('@', exports.identPatternToken, (0, rules_1.maybe)(exports.argumentExpressionList)), exports.alignAttr, exports.bindingAttr, exports.builtinAttr, exports.constAttr, exports.diagnosticAttr, exports.groupAttr, exports.idAttr, exports.interpolateAttr, exports.invariantAttr, exports.locationAttr, exports.mustUseAttr, exports.sizeAttr, exports.workgroupSizeAttr, exports.vertexAttr, exports.fragmentAttr, exports.computeAttr));
exports.diagnosticControl.set((0, rules_1.union)((0, rules_1.sequence)('(', exports.severityControlName, ',', exports.diagnosticRuleName, (0, rules_1.maybe)(','), ')')));
exports.structDecl.set((0, rules_1.union)((0, rules_1.sequence)('struct', exports.ident, exports.structBodyDecl)));
exports.structBodyDecl.set((0, rules_1.union)((0, rules_1.sequence)('{', exports.structMember, (0, rules_1.star)((0, rules_1.sequence)(',', exports.structMember)), (0, rules_1.maybe)(','), '}')));
exports.structMember.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.attribute), exports.memberIdent, ':', exports.typeSpecifier)));
exports.typeAliasDecl.set((0, rules_1.union)((0, rules_1.sequence)('alias', exports.ident, '=', exports.typeSpecifier)));
exports.typeSpecifier.set((0, rules_1.union)(exports.templateElaboratedIdent));
exports.templateElaboratedIdent.set((0, rules_1.union)((0, rules_1.sequence)(exports.ident, (0, rules_1.maybe)(exports.templateList))));
exports.variableOrValueStatement.set((0, rules_1.union)(exports.variableDecl, (0, rules_1.sequence)(exports.variableDecl, '=', exports.expression), (0, rules_1.sequence)('let', exports.optionallyTypedIdent, '=', exports.expression), (0, rules_1.sequence)('const', exports.optionallyTypedIdent, '=', exports.expression)));
exports.variableDecl.set((0, rules_1.union)((0, rules_1.sequence)('var', (0, rules_1.maybe)(exports.templateList), exports.optionallyTypedIdent)));
exports.optionallyTypedIdent.set((0, rules_1.union)((0, rules_1.sequence)(exports.ident, (0, rules_1.maybe)((0, rules_1.sequence)(':', exports.typeSpecifier)))));
exports.globalVariableDecl.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.attribute), exports.variableDecl, (0, rules_1.maybe)((0, rules_1.sequence)('=', exports.expression)))));
exports.globalValueDecl.set((0, rules_1.union)((0, rules_1.sequence)('const', exports.optionallyTypedIdent, '=', exports.expression), (0, rules_1.sequence)((0, rules_1.star)(exports.attribute), 'override', exports.optionallyTypedIdent, (0, rules_1.maybe)((0, rules_1.sequence)('=', exports.expression)))));
exports.primaryExpression.set((0, rules_1.union)(exports.templateElaboratedIdent, exports.callExpression, exports.literal, exports.parenExpression));
exports.callExpression.set((0, rules_1.union)(exports.callPhrase));
exports.callPhrase.set((0, rules_1.union)((0, rules_1.sequence)(exports.templateElaboratedIdent, exports.argumentExpressionList)));
exports.parenExpression.set((0, rules_1.union)((0, rules_1.sequence)('(', exports.expression, ')')));
exports.argumentExpressionList.set((0, rules_1.union)((0, rules_1.sequence)('(', (0, rules_1.maybe)(exports.expressionCommaList), ')')));
exports.expressionCommaList.set((0, rules_1.union)((0, rules_1.sequence)(exports.expression, (0, rules_1.star)((0, rules_1.sequence)(',', exports.expression)), (0, rules_1.maybe)(','))));
exports.componentOrSwizzleSpecifier.set((0, rules_1.union)((0, rules_1.sequence)('[', exports.expression, ']', (0, rules_1.maybe)(exports.componentOrSwizzleSpecifier)), (0, rules_1.sequence)('.', exports.memberIdent, (0, rules_1.maybe)(exports.componentOrSwizzleSpecifier)), (0, rules_1.sequence)('.', exports.swizzleName, (0, rules_1.maybe)(exports.componentOrSwizzleSpecifier))));
exports.unaryExpression.set((0, rules_1.union)(exports.singularExpression, (0, rules_1.sequence)('-', exports.unaryExpression), (0, rules_1.sequence)('!', exports.unaryExpression), (0, rules_1.sequence)('~', exports.unaryExpression), (0, rules_1.sequence)('*', exports.unaryExpression), (0, rules_1.sequence)('&', exports.unaryExpression)));
exports.singularExpression.set((0, rules_1.union)((0, rules_1.sequence)(exports.primaryExpression, (0, rules_1.maybe)(exports.componentOrSwizzleSpecifier))));
exports.lhsExpression.set((0, rules_1.union)((0, rules_1.sequence)(exports.coreLhsExpression, (0, rules_1.maybe)(exports.componentOrSwizzleSpecifier)), (0, rules_1.sequence)('*', exports.lhsExpression), (0, rules_1.sequence)('&', exports.lhsExpression)));
exports.coreLhsExpression.set((0, rules_1.union)(exports.ident, (0, rules_1.sequence)('(', exports.lhsExpression, ')')));
exports.multiplicativeExpression.set((0, rules_1.union)(exports.unaryExpression, (0, rules_1.sequence)(exports.multiplicativeExpression, exports.multiplicativeOperator, exports.unaryExpression)));
exports.multiplicativeOperator.set((0, rules_1.union)('*', '/', '%'));
exports.additiveExpression.set((0, rules_1.union)(exports.multiplicativeExpression, (0, rules_1.sequence)(exports.additiveExpression, exports.additiveOperator, exports.multiplicativeExpression)));
exports.additiveOperator.set((0, rules_1.union)('+', '-'));
exports.shiftExpression.set((0, rules_1.union)(exports.additiveExpression, (0, rules_1.sequence)(exports.unaryExpression, SHIFT_LEFT, exports.unaryExpression), (0, rules_1.sequence)(exports.unaryExpression, SHIFT_RIGHT, exports.unaryExpression)));
exports.relationalExpression.set((0, rules_1.union)(exports.shiftExpression, (0, rules_1.sequence)(exports.shiftExpression, LESS_THAN, exports.shiftExpression), (0, rules_1.sequence)(exports.shiftExpression, GREATER_THAN, exports.shiftExpression), (0, rules_1.sequence)(exports.shiftExpression, LESS_THAN_EQUAL, exports.shiftExpression), (0, rules_1.sequence)(exports.shiftExpression, GREATER_THAN_EQUAL, exports.shiftExpression), (0, rules_1.sequence)(exports.shiftExpression, '==', exports.shiftExpression), (0, rules_1.sequence)(exports.shiftExpression, '!=', exports.shiftExpression)));
exports.shortCircuitAndExpression.set((0, rules_1.union)(exports.relationalExpression, (0, rules_1.sequence)(exports.shortCircuitAndExpression, '&&', exports.relationalExpression)));
exports.shortCircuitOrExpression.set((0, rules_1.union)(exports.relationalExpression, (0, rules_1.sequence)(exports.shortCircuitOrExpression, '||', exports.relationalExpression)));
exports.binaryOrExpression.set((0, rules_1.union)(exports.unaryExpression, (0, rules_1.sequence)(exports.binaryOrExpression, '|', exports.unaryExpression)));
exports.binaryAndExpression.set((0, rules_1.union)(exports.unaryExpression, (0, rules_1.sequence)(exports.binaryAndExpression, '&', exports.unaryExpression)));
exports.binaryXorExpression.set((0, rules_1.union)(exports.unaryExpression, (0, rules_1.sequence)(exports.binaryXorExpression, '^', exports.unaryExpression)));
exports.bitwiseExpression.set((0, rules_1.union)((0, rules_1.sequence)(exports.binaryAndExpression, '&', exports.unaryExpression), (0, rules_1.sequence)(exports.binaryOrExpression, '|', exports.unaryExpression), (0, rules_1.sequence)(exports.binaryXorExpression, '^', exports.unaryExpression)));
exports.expression.set((0, rules_1.union)(exports.relationalExpression, (0, rules_1.sequence)(exports.shortCircuitOrExpression, '||', exports.relationalExpression), (0, rules_1.sequence)(exports.shortCircuitAndExpression, '&&', exports.relationalExpression), exports.bitwiseExpression));
exports.compoundStatement.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.attribute), '{', (0, rules_1.star)(exports.statement), '}')));
exports.assignmentStatement.set((0, rules_1.union)((0, rules_1.sequence)(exports.lhsExpression, '=', exports.expression), (0, rules_1.sequence)(exports.lhsExpression, exports.compoundAssignmentOperator, exports.expression), (0, rules_1.sequence)('_', '=', exports.expression)));
exports.compoundAssignmentOperator.set((0, rules_1.union)('+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', SHIFT_RIGHT_ASSIGN, SHIFT_LEFT_ASSIGN));
exports.incrementStatement.set((0, rules_1.union)((0, rules_1.sequence)(exports.lhsExpression, '++')));
exports.decrementStatement.set((0, rules_1.union)((0, rules_1.sequence)(exports.lhsExpression, '--')));
exports.ifStatement.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.attribute), exports.ifClause, (0, rules_1.star)(exports.elseIfClause), (0, rules_1.maybe)(exports.elseClause))));
exports.ifClause.set((0, rules_1.union)((0, rules_1.sequence)('if', exports.expression, exports.compoundStatement)));
exports.elseIfClause.set((0, rules_1.union)((0, rules_1.sequence)('else', 'if', exports.expression, exports.compoundStatement)));
exports.elseClause.set((0, rules_1.union)((0, rules_1.sequence)('else', exports.compoundStatement)));
exports.switchStatement.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.attribute), 'switch', exports.expression, exports.switchBody)));
exports.switchBody.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.attribute), '{', exports.switchClause, '}')));
exports.switchClause.set((0, rules_1.union)(exports.caseClause, exports.defaultAloneClause));
exports.caseClause.set((0, rules_1.union)((0, rules_1.sequence)('case', exports.caseSelectors, (0, rules_1.maybe)(':'), exports.compoundStatement)));
exports.defaultAloneClause.set((0, rules_1.union)((0, rules_1.sequence)('default', (0, rules_1.maybe)(':'), exports.compoundStatement)));
exports.caseSelectors.set((0, rules_1.union)((0, rules_1.sequence)(exports.caseSelector, (0, rules_1.star)((0, rules_1.sequence)(',', exports.caseSelector)), (0, rules_1.maybe)(','))));
exports.caseSelector.set((0, rules_1.union)('default', exports.expression));
exports.loopStatement.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.attribute), 'loop', (0, rules_1.star)(exports.attribute), '{', (0, rules_1.star)(exports.statement), (0, rules_1.maybe)(exports.continuingStatement), '}')));
exports.forStatement.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.attribute), 'for', '(', exports.forHeader, ')', exports.compoundStatement)));
exports.forHeader.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.maybe)(exports.forInit), ';', (0, rules_1.maybe)(exports.expression), ';', (0, rules_1.maybe)(exports.forUpdate))));
exports.forInit.set((0, rules_1.union)(exports.variableOrValueStatement, exports.variableUpdatingStatement, exports.funcCallStatement));
exports.forUpdate.set((0, rules_1.union)(exports.variableUpdatingStatement, exports.funcCallStatement));
exports.whileStatement.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.attribute), 'while', exports.expression, exports.compoundStatement)));
exports.breakStatement.set((0, rules_1.union)('break'));
exports.breakIfStatement.set((0, rules_1.union)((0, rules_1.sequence)('break', 'if', exports.expression, ';')));
exports.continueStatement.set((0, rules_1.union)('continue'));
exports.continuingStatement.set((0, rules_1.union)((0, rules_1.sequence)('continuing', exports.continuingCompoundStatement)));
exports.continuingCompoundStatement.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.attribute), '{', (0, rules_1.star)(exports.statement), (0, rules_1.maybe)(exports.breakIfStatement), '}')));
exports.returnStatement.set((0, rules_1.union)((0, rules_1.sequence)('return', (0, rules_1.maybe)(exports.expression))));
exports.funcCallStatement.set((0, rules_1.union)(exports.callPhrase));
exports.constAssertStatement.set((0, rules_1.union)((0, rules_1.sequence)('const_assert', exports.expression)));
exports.statement.set((0, rules_1.union)(';', (0, rules_1.sequence)(exports.returnStatement, ';'), exports.ifStatement, exports.switchStatement, exports.loopStatement, exports.forStatement, exports.whileStatement, (0, rules_1.sequence)(exports.funcCallStatement, ';'), (0, rules_1.sequence)(exports.variableOrValueStatement, ';'), (0, rules_1.sequence)(exports.breakStatement, ';'), (0, rules_1.sequence)(exports.continueStatement, ';'), (0, rules_1.sequence)('discard', ';'), (0, rules_1.sequence)(exports.variableUpdatingStatement, ';'), exports.compoundStatement, (0, rules_1.sequence)(exports.constAssertStatement, ';')));
exports.variableUpdatingStatement.set((0, rules_1.union)(exports.assignmentStatement, exports.incrementStatement, exports.decrementStatement));
exports.functionDecl.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.attribute), exports.functionHeader, exports.compoundStatement)));
exports.functionHeader.set((0, rules_1.union)((0, rules_1.sequence)('fn', exports.ident, '(', (0, rules_1.maybe)(exports.paramList), ')', (0, rules_1.maybe)((0, rules_1.sequence)('->', (0, rules_1.star)(exports.attribute), exports.templateElaboratedIdent)))));
exports.paramList.set((0, rules_1.union)((0, rules_1.sequence)(exports.param, (0, rules_1.star)((0, rules_1.sequence)(',', exports.param)), (0, rules_1.maybe)(','))));
exports.param.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.attribute), exports.ident, ':', exports.typeSpecifier)));
exports.enableDirective.set((0, rules_1.union)((0, rules_1.sequence)('enable', exports.enableExtensionList, ';')));
exports.enableExtensionList.set((0, rules_1.union)((0, rules_1.sequence)(exports.enableExtensionName, (0, rules_1.star)((0, rules_1.sequence)(',', exports.enableExtensionName)), (0, rules_1.maybe)(','))));
exports.requiresDirective.set((0, rules_1.union)((0, rules_1.sequence)('requires', exports.softwareExtensionList, ';')));
exports.softwareExtensionList.set((0, rules_1.union)((0, rules_1.sequence)(exports.softwareExtensionName, (0, rules_1.star)((0, rules_1.sequence)(',', exports.softwareExtensionName)), (0, rules_1.maybe)(','))));
exports.enableExtensionName.set((0, rules_1.union)(exports.identPatternToken));
exports.softwareExtensionName.set((0, rules_1.union)(exports.identPatternToken));
exports.identPatternToken.set((0, rules_1.union)(/([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/u));
exports.severityControlName.set((0, rules_1.union)(exports.identPatternToken));
exports.swizzleName.set((0, rules_1.union)(/[rgba]/, /[rgba][rgba]/, /[rgba][rgba][rgba]/, /[rgba][rgba][rgba][rgba]/, /[xyzw]/, /[xyzw][xyzw]/, /[xyzw][xyzw][xyzw]/, /[xyzw][xyzw][xyzw][xyzw]/));
exports.translationUnitExtended = (0, rules_1.symbol)('translation_unit_extended');
exports.globalDirectiveExtended = (0, rules_1.symbol)('global_directive_extended');
exports.includeDirective = (0, rules_1.symbol)('include_directive');
exports.includePath = (0, rules_1.symbol)('include_path');
exports.translationUnitExtended.set((0, rules_1.union)((0, rules_1.sequence)((0, rules_1.star)(exports.globalDirectiveExtended), (0, rules_1.star)(exports.globalDecl))));
exports.globalDirectiveExtended.set((0, rules_1.union)(exports.diagnosticDirective, exports.enableDirective, exports.requiresDirective, exports.includeDirective));
exports.includeDirective.set((0, rules_1.union)((0, rules_1.sequence)('import', exports.includePath, ';')));
exports.includePath.set((0, rules_1.union)(/"[^*"/>:|?]+"/));
