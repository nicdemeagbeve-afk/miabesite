"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=<dyad-problem-report summary="264 problems">
<problem file="src/components/ui/switch.tsx" line="14" column="250" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="14" column="252" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="14" column="260" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="14" column="262" code="1002">Unterminated string literal.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="10" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="44" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="54" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="66" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="87" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="93" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="98" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="102" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="108" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="111" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="116" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="156" code="1003">Identifier expected.</problem>
<problem file="src/components/ui/switch.tsx" line="16" column="1" code="2657">JSX expressions must have one parent element.</problem>
<problem file="src/components/ui/switch.tsx" line="23" column="1" code="1005">',' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="23" column="24" code="17008">JSX element 'think' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="40" column="111" code="17008">JSX element 'ReadonlyRequestCookies' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="49" column="108" code="17008">JSX element 'ReadonlyRequestCookies' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="65" column="3" code="17002">Expected corresponding JSX closing tag for 'ReadonlyRequestCookies'.</problem>
<problem file="src/components/ui/switch.tsx" line="71" column="102" code="17008">JSX element 'ReadonlyRequestCookies' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="75" column="2" code="17008">JSX element 'dyad-write' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="85" column="8" code="1005">'}' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="88" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="96" column="38" code="1145">'{' or JSX element expected.</problem>
<problem file="src/components/ui/switch.tsx" line="96" column="49" code="1003">Identifier expected.</problem>
<problem file="src/components/ui/switch.tsx" line="97" column="27" code="17008">JSX element 'TFieldValues' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="97" column="53" code="17008">JSX element 'TFieldValues' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="98" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="99" column="7" code="1005">'}' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="100" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="102" column="46" code="17008">JSX element 'FormFieldContextValue' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="107" column="38" code="1145">'{' or JSX element expected.</problem>
<problem file="src/components/ui/switch.tsx" line="107" column="49" code="1003">Identifier expected.</problem>
<problem file="src/components/ui/switch.tsx" line="108" column="27" code="17008">JSX element 'TFieldValues' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="108" column="53" code="17008">JSX element 'TFieldValues' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="109" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="110" column="38" code="1003">Identifier expected.</problem>
<problem file="src/components/ui/switch.tsx" line="110" column="45" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="111" column="4" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="112" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="117" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="120" column="5" code="1005">'}' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="121" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="123" column="45" code="17008">JSX element 'FormItemContextValue' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="127" column="26" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="128" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="135" column="5" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="135" column="58" code="17008">JSX element 'FormField' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="136" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="142" column="9" code="1005">'}' expected.</problem>
<problem file="src/components/ui/switch.tsx" line="149" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="150" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="153" column="17" code="1003">Identifier expected.</problem>
<problem file="src/components/ui/switch.tsx" line="154" column="24" code="17008">JSX element 'HTMLDivElement' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="155" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="155" column="17" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="155" column="26" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="155" column="35" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="156" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="163" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="167" column="47" code="1003">Identifier expected.</problem>
<problem file="src/components/ui/switch.tsx" line="168" column="55" code="1003">Identifier expected.</problem>
<problem file="src/components/ui/switch.tsx" line="168" column="60" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="169" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="169" column="17" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="169" column="26" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="169" column="35" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="170" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="180" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="184" column="32" code="1003">Identifier expected.</problem>
<problem file="src/components/ui/switch.tsx" line="185" column="34" code="17008">JSX element 'typeof' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="186" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="186" column="24" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="187" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="202" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="206" column="23" code="1003">Identifier expected.</problem>
<problem file="src/components/ui/switch.tsx" line="207" column="24" code="17008">JSX element 'HTMLParagraphElement' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="208" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="208" column="17" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="208" column="26" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="208" column="35" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="209" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="219" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="223" column="23" code="1003">Identifier expected.</problem>
<problem file="src/components/ui/switch.tsx" line="224" column="24" code="17008">JSX element 'HTMLParagraphElement' has no corresponding closing tag.</problem>
<problem file="src/components/ui/switch.tsx" line="225" column="1" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="225" column="27" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="225" column="36" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="225" column="45" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/ui/switch.tsx" line="226" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="230" column="5" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="231" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="243" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/ui/switch.tsx" line="255" column="1" code="1109">Expression expected.</problem>
<problem file="src/components/ui/switch.tsx" line="255" column="3" code="1005">'&lt;/' expected.</problem>
<problem file="src/components/ui/form.tsx" line="117" column="10" code="2304">Cannot find name 'formState'.</problem>
<problem file="src/components/ui/form.tsx" line="117" column="27" code="2552">Cannot find name 'fieldContext'. Did you mean 'FormFieldContext'?</problem>
<problem file="src/components/ui/form.tsx" line="121" column="23" code="2304">Cannot find name 'formState'.</problem>
<problem file="src/components/ui/form.tsx" line="121" column="40" code="2552">Cannot find name 'fieldContext'. Did you mean 'FormFieldContext'?</problem>
<problem file="src/components/ui/switch.tsx" line="14" column="252" code="2304">Cannot find name 'problems'.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="2" code="2304">Cannot find name 'problem'.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="10" code="2552">Cannot find name 'file'. Did you mean 'File'?</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="44" code="2304">Cannot find name 'line'.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="54" code="2304">Cannot find name 'column'.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="66" code="2304">Cannot find name 'code'.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="78" code="2304">Cannot find name 'Property'.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="93" code="2304">Cannot find name 'does'.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="98" code="2304">Cannot find name 'not'.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="102" code="2304">Cannot find name 'exist'.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="108" code="2304">Cannot find name 'on'.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="111" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ui/switch.tsx" line="15" column="158" code="2304">Cannot find name 'problem'.</problem>
<problem file="src/components/ui/switch.tsx" line="16" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="16" column="156" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="17" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="17" column="156" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="18" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="18" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="19" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="19" column="144" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="20" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="20" column="108" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="21" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="21" column="144" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="22" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="22" column="180" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="23" column="3" code="2304">Cannot find name 'dyad'.</problem>
<problem file="src/components/ui/switch.tsx" line="23" column="3" code="2365">Operator '&gt;' cannot be applied to types 'number' and 'Element'.</problem>
<problem file="src/components/ui/switch.tsx" line="23" column="8" code="2304">Cannot find name 'problem'.</problem>
<problem file="src/components/ui/switch.tsx" line="23" column="16" code="2552">Cannot find name 'report'. Did you mean 'Report'?</problem>
<problem file="src/components/ui/switch.tsx" line="23" column="23" code="2339">Property 'think' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="40" column="111" code="2304">Cannot find name 'ReadonlyRequestCookies'.</problem>
<problem file="src/components/ui/switch.tsx" line="49" column="108" code="2304">Cannot find name 'ReadonlyRequestCookies'.</problem>
<problem file="src/components/ui/switch.tsx" line="57" column="117" code="2304">Cannot find name 'ReadonlyRequestCookies'.</problem>
<problem file="src/components/ui/switch.tsx" line="65" column="1" code="2339">Property 'think' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="71" column="102" code="2304">Cannot find name 'ReadonlyRequestCookies'.</problem>
<problem file="src/components/ui/switch.tsx" line="75" column="1" code="2339">Property 'dyad-write' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="80" column="10" code="2304">Cannot find name 'Slot'.</problem>
<problem file="src/components/ui/switch.tsx" line="82" column="3" code="2304">Cannot find name 'Controller'.</problem>
<problem file="src/components/ui/switch.tsx" line="82" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="82" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="82" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="83" column="3" code="2304">Cannot find name 'FormProvider'.</problem>
<problem file="src/components/ui/switch.tsx" line="84" column="3" code="2304">Cannot find name 'useFormContext'.</problem>
<problem file="src/components/ui/switch.tsx" line="85" column="3" code="2304">Cannot find name 'type'.</problem>
<problem file="src/components/ui/switch.tsx" line="91" column="10" code="2304">Cannot find name 'Label'.</problem>
<problem file="src/components/ui/switch.tsx" line="96" column="3" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="src/components/ui/switch.tsx" line="97" column="27" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="src/components/ui/switch.tsx" line="97" column="53" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="src/components/ui/switch.tsx" line="102" column="46" code="2304">Cannot find name 'FormFieldContextValue'.</problem>
<problem file="src/components/ui/switch.tsx" line="107" column="3" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="src/components/ui/switch.tsx" line="108" column="27" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="src/components/ui/switch.tsx" line="108" column="53" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="src/components/ui/switch.tsx" line="110" column="26" code="2304">Cannot find name 'TFieldValues'.</problem>
<problem file="src/components/ui/switch.tsx" line="113" column="6" code="2304">Cannot find name 'FormFieldContext'.</problem>
<problem file="src/components/ui/switch.tsx" line="113" column="47" code="2304">Cannot find name 'props'.</problem>
<problem file="src/components/ui/switch.tsx" line="114" column="8" code="2304">Cannot find name 'Controller'.</problem>
<problem file="src/components/ui/switch.tsx" line="114" column="23" code="2304">Cannot find name 'props'.</problem>
<problem file="src/components/ui/switch.tsx" line="115" column="7" code="2304">Cannot find name 'FormFieldContext'.</problem>
<problem file="src/components/ui/switch.tsx" line="120" column="3" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/ui/switch.tsx" line="123" column="45" code="2304">Cannot find name 'FormItemContextValue'.</problem>
<problem file="src/components/ui/switch.tsx" line="130" column="11" code="2304">Cannot find name 'getFieldState'.</problem>
<problem file="src/components/ui/switch.tsx" line="130" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="130" column="26" code="2304">Cannot find name 'formState'.</problem>
<problem file="src/components/ui/switch.tsx" line="135" column="58" code="2304">Cannot find name 'FormField'.</problem>
<problem file="src/components/ui/switch.tsx" line="141" column="5" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/ui/switch.tsx" line="141" column="5" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="143" column="20" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/ui/switch.tsx" line="144" column="27" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/ui/switch.tsx" line="145" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/ui/switch.tsx" line="153" column="3" code="2786">'HTMLDivElement' cannot be used as a JSX component.
  Its type '{ new (): HTMLDivElement; prototype: HTMLDivElement; }' is not a valid JSX element type.
    Type '{ new (): HTMLDivElement; prototype: HTMLDivElement; }' is not assignable to type 'new (props: any) =&gt; Component&lt;any, any, any&gt;'.
      Type 'HTMLDivElement' is missing the following properties from type 'Component&lt;any, any, any&gt;': context, setState, forceUpdate, render, and 2 more.</problem>
<problem file="src/components/ui/switch.tsx" line="154" column="24" code="2786">'HTMLDivElement' cannot be used as a JSX component.
  Its type '{ new (): HTMLDivElement; prototype: HTMLDivElement; }' is not a valid JSX element type.
    Type '{ new (): HTMLDivElement; prototype: HTMLDivElement; }' is not assignable to type 'new (props: any) =&gt; Component&lt;any, any, any&gt;'.
      Type 'HTMLDivElement' is missing the following properties from type 'Component&lt;any, any, any&gt;': context, setState, forceUpdate, render, and 2 more.</problem>
<problem file="src/components/ui/switch.tsx" line="155" column="6" code="2304">Cannot find name 'className'.</problem>
<problem file="src/components/ui/switch.tsx" line="155" column="6" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="159" column="6" code="2304">Cannot find name 'FormItemContext'.</problem>
<problem file="src/components/ui/switch.tsx" line="159" column="40" code="18004">No value exists in scope for the shorthand property 'id'. Either declare one or provide an initializer.</problem>
<problem file="src/components/ui/switch.tsx" line="160" column="17" code="2304">Cannot find name 'ref'.</problem>
<problem file="src/components/ui/switch.tsx" line="160" column="49" code="2304">Cannot find name 'className'.</problem>
<problem file="src/components/ui/switch.tsx" line="160" column="65" code="2304">Cannot find name 'props'.</problem>
<problem file="src/components/ui/switch.tsx" line="161" column="7" code="2304">Cannot find name 'FormItemContext'.</problem>
<problem file="src/components/ui/switch.tsx" line="167" column="9" code="2339">Property 'ElementRef' does not exist on type 'typeof import(&quot;/home/nicodeme/dyad-apps/glowing-fox-scurry/node_modules/.pnpm/@types+react@19.1.5/node_modules/@types/react/index.d.ts&quot;)'.</problem>
<problem file="src/components/ui/switch.tsx" line="167" column="27" code="2304">Cannot find name 'LabelPrimitive'.</problem>
<problem file="src/components/ui/switch.tsx" line="168" column="33" code="2339">Property 'typeof' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="169" column="6" code="2304">Cannot find name 'className'.</problem>
<problem file="src/components/ui/switch.tsx" line="169" column="6" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="170" column="11" code="2304">Cannot find name 'error'.</problem>
<problem file="src/components/ui/switch.tsx" line="170" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="170" column="18" code="2304">Cannot find name 'formItemId'.</problem>
<problem file="src/components/ui/switch.tsx" line="173" column="6" code="2304">Cannot find name 'Label'.</problem>
<problem file="src/components/ui/switch.tsx" line="174" column="12" code="2304">Cannot find name 'ref'.</problem>
<problem file="src/components/ui/switch.tsx" line="175" column="21" code="2304">Cannot find name 'error'.</problem>
<problem file="src/components/ui/switch.tsx" line="175" column="50" code="2304">Cannot find name 'className'.</problem>
<problem file="src/components/ui/switch.tsx" line="176" column="16" code="2304">Cannot find name 'formItemId'.</problem>
<problem file="src/components/ui/switch.tsx" line="177" column="11" code="2304">Cannot find name 'props'.</problem>
<problem file="src/components/ui/switch.tsx" line="184" column="9" code="2339">Property 'ElementRef' does not exist on type 'typeof import(&quot;/home/nicodeme/dyad-apps/glowing-fox-scurry/node_modules/.pnpm/@types+react@19.1.5/node_modules/@types/react/index.d.ts&quot;)'.</problem>
<problem file="src/components/ui/switch.tsx" line="184" column="27" code="2304">Cannot find name 'Slot'.</problem>
<problem file="src/components/ui/switch.tsx" line="185" column="33" code="2339">Property 'typeof' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/ui/switch.tsx" line="186" column="4" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/ui/switch.tsx" line="186" column="9" code="2304">Cannot find name 'props'.</problem>
<problem file="src/components/ui/switch.tsx" line="187" column="11" code="2304">Cannot find name 'formItemId'.</problem>
<problem file="src/components/ui/switch.tsx" line="187" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="187" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="187" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="187" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="187" column="23" code="2304">Cannot find name 'formDescriptionId'.</problem>
<problem file="src/components/ui/switch.tsx" line="187" column="42" code="2304">Cannot find name 'formMessageId'.</problem>
<problem file="src/components/ui/switch.tsx" line="187" column="57" code="2304">Cannot find name 'formState'.</problem>
<problem file="src/components/ui/switch.tsx" line="187" column="68" code="2304">Cannot find name 'fieldContext'.</problem>
<problem file="src/components/ui/switch.tsx" line="190" column="6" code="2304">Cannot find name 'Slot'.</problem>
<problem file="src/components/ui/switch.tsx" line="191" column="12" code="2304">Cannot find name 'ref'.</problem>
<problem file="src/components/ui/switch.tsx" line="192" column="11" code="2304">Cannot find name 'formItemId'.</problem>
<problem file="src/components/ui/switch.tsx" line="194" column="10" code="2304">Cannot find name 'formState'.</problem>
<problem file="src/components/ui/switch.tsx" line="194" column="27" code="2304">Cannot find name 'fieldContext'.</problem>
<problem file="src/components/ui/switch.tsx" line="195" column="16" code="2304">Cannot find name 'formDescriptionId'.</problem>
<problem file="src/components/ui/switch.tsx" line="196" column="16" code="2304">Cannot find name 'formDescriptionId'.</problem>
<problem file="src/components/ui/switch.tsx" line="196" column="37" code="2304">Cannot find name 'formMessageId'.</problem>
<problem file="src/components/ui/switch.tsx" line="198" column="23" code="2304">Cannot find name 'formState'.</problem>
<problem file="src/components/ui/switch.tsx" line="198" column="40" code="2304">Cannot find name 'fieldContext'.</problem>
<problem file="src/components/ui/switch.tsx" line="199" column="11" code="2304">Cannot find name 'props'.</problem>
<problem file="src/components/ui/switch.tsx" line="206" column="3" code="2786">'HTMLParagraphElement' cannot be used as a JSX component.
  Its type '{ new (): HTMLParagraphElement; prototype: HTMLParagraphElement; }' is not a valid JSX element type.
    Type '{ new (): HTMLParagraphElement; prototype: HTMLParagraphElement; }' is not assignable to type 'new (props: any) =&gt; Component&lt;any, any, any&gt;'.
      Type 'HTMLParagraphElement' is missing the following properties from type 'Component&lt;any, any, any&gt;': context, setState, forceUpdate, render, and 2 more.</problem>
<problem file="src/components/ui/switch.tsx" line="207" column="24" code="2786">'HTMLParagraphElement' cannot be used as a JSX component.
  Its type '{ new (): HTMLParagraphElement; prototype: HTMLParagraphElement; }' is not a valid JSX element type.
    Type '{ new (): HTMLParagraphElement; prototype: HTMLParagraphElement; }' is not assignable to type 'new (props: any) =&gt; Component&lt;any, any, any&gt;'.
      Type 'HTMLParagraphElement' is missing the following properties from type 'Component&lt;any, any, any&gt;': context, setState, forceUpdate, render, and 2 more.</problem>
<problem file="src/components/ui/switch.tsx" line="208" column="6" code="2304">Cannot find name 'className'.</problem>
<problem file="src/components/ui/switch.tsx" line="208" column="6" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="209" column="11" code="2304">Cannot find name 'formDescriptionId'.</problem>
<problem file="src/components/ui/switch.tsx" line="213" column="12" code="2304">Cannot find name 'ref'.</problem>
<problem file="src/components/ui/switch.tsx" line="214" column="11" code="2304">Cannot find name 'formDescriptionId'.</problem>
<problem file="src/components/ui/switch.tsx" line="215" column="54" code="2304">Cannot find name 'className'.</problem>
<problem file="src/components/ui/switch.tsx" line="216" column="11" code="2304">Cannot find name 'props'.</problem>
<problem file="src/components/ui/switch.tsx" line="223" column="3" code="2786">'HTMLParagraphElement' cannot be used as a JSX component.
  Its type '{ new (): HTMLParagraphElement; prototype: HTMLParagraphElement; }' is not a valid JSX element type.
    Type '{ new (): HTMLParagraphElement; prototype: HTMLParagraphElement; }' is not assignable to type 'new (props: any) =&gt; Component&lt;any, any, any&gt;'.
      Type 'HTMLParagraphElement' is missing the following properties from type 'Component&lt;any, any, any&gt;': context, setState, forceUpdate, render, and 2 more.</problem>
<problem file="src/components/ui/switch.tsx" line="224" column="24" code="2786">'HTMLParagraphElement' cannot be used as a JSX component.
  Its type '{ new (): HTMLParagraphElement; prototype: HTMLParagraphElement; }' is not a valid JSX element type.
    Type '{ new (): HTMLParagraphElement; prototype: HTMLParagraphElement; }' is not assignable to type 'new (props: any) =&gt; Component&lt;any, any, any&gt;'.
      Type 'HTMLParagraphElement' is missing the following properties from type 'Component&lt;any, any, any&gt;': context, setState, forceUpdate, render, and 2 more.</problem>
<problem file="src/components/ui/switch.tsx" line="225" column="6" code="2304">Cannot find name 'className'.</problem>
<problem file="src/components/ui/switch.tsx" line="225" column="6" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="225" column="6" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="225" column="17" code="2304">Cannot find name 'children'.</problem>
<problem file="src/components/ui/switch.tsx" line="226" column="11" code="2304">Cannot find name 'error'.</problem>
<problem file="src/components/ui/switch.tsx" line="226" column="11" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="226" column="18" code="2304">Cannot find name 'formMessageId'.</problem>
<problem file="src/components/ui/switch.tsx" line="235" column="12" code="2304">Cannot find name 'ref'.</problem>
<problem file="src/components/ui/switch.tsx" line="236" column="11" code="2304">Cannot find name 'formMessageId'.</problem>
<problem file="src/components/ui/switch.tsx" line="237" column="61" code="2304">Cannot find name 'className'.</problem>
<problem file="src/components/ui/switch.tsx" line="238" column="11" code="2304">Cannot find name 'props'.</problem>
<problem file="src/components/ui/switch.tsx" line="240" column="8" code="2304">Cannot find name 'body'.</problem>
<problem file="src/components/ui/switch.tsx" line="247" column="3" code="2304">Cannot find name 'useFormField'.</problem>
<problem file="src/components/ui/switch.tsx" line="247" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="247" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="247" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="247" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="247" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="247" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="247" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="247" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/ui/switch.tsx" line="248" column="3" code="2304">Cannot find name 'Form'.</problem>
<problem file="src/components/ui/switch.tsx" line="249" column="3" code="2304">Cannot find name 'FormItem'.</problem>
<problem file="src/components/ui/switch.tsx" line="250" column="3" code="2304">Cannot find name 'FormLabel'.</problem>
<problem file="src/components/ui/switch.tsx" line="251" column="3" code="2304">Cannot find name 'FormControl'.</problem>
<problem file="src/components/ui/switch.tsx" line="252" column="3" code="2304">Cannot find name 'FormDescription'.</problem>
<problem file="src/components/ui/switch.tsx" line="253" column="3" code="2304">Cannot find name 'FormMessage'.</problem>
<problem file="src/components/ui/switch.tsx" line="254" column="3" code="2304">Cannot find name 'FormField'.</problem>
<problem file="src/components/dashboard/ContentModification.tsx" line="20" column="10" code="2459">Module '&quot;@/components/ui/switch&quot;' declares 'Switch' locally, but it is not exported.</problem>
<problem file="src/app/dashboard/overview/page.tsx" line="111" column="34" code="2322">Type '{ siteData: SiteData; }' is not assignable to type 'IntrinsicAttributes'.
  Property 'siteData' does not exist on type 'IntrinsicAttributes'.</problem>
<problem file="src/app/dashboard/overview/page.tsx" line="112" column="25" code="2322">Type '{ siteData: SiteData; }' is not assignable to type 'IntrinsicAttributes'.
  Property 'siteData' does not exist on type 'IntrinsicAttributes'.</problem>
</dyad-problem-report><think>**Analyzing TypeScript Errors**

I'm currently focused on the deluge of TypeScript errors. The primary culprit appears to be a corrupted `switch.tsx` file, which I'll prioritize restoring. I'm also investigating issues within `server.ts` related to Supabase and potential prop type conflicts in the dashboard components. My immediate goal is to get the `switch.tsx` file back to a functional state.


**Restoring Switch Component**

I'm now fully focused on fixing the `switch.tsx` component. The truncated code is the main issue. My top priority is implementing the complete, correct Shadcn UI `Switch` component code. I'll make sure it's fully functional before moving on. The Supabase server file is next, and then I'll address prop type issues.


**Prioritizing Code Restoration**

I've determined the primary focus is still on restoring `switch.tsx`. The initial fix was insufficient, so I'm now implementing the complete, valid Shadcn UI `Switch` component code. I'm prioritizing this restoration. Then, I'll tackle the `server.ts` file, where the `cookies()` function's placement is causing issues. Finally, I'll address the missing `siteData` prop types in the dashboard components, starting with `OverviewAndQuickActions.tsx` and `DashboardStats.tsx`. I'll introduce a props interface to each of them.


</think>It looks like the `src/components/ui/switch.tsx` file was indeed corrupted again, leading to a cascade of syntax and type errors. Additionally, the `src/lib/supabase/server.ts` file had an issue with how `cookies()` was being accessed, and the dashboard components `OverviewAndQuickActions` and `DashboardStats` were missing their prop type definitions.

I've addressed these issues as follows:

1.  **Restored `src/components/ui/switch.tsx`**: I've replaced the corrupted content with the complete and correct Shadcn UI `Switch` component code. This resolves all the syntax and related type errors originating from this file.
2.  **Fixed `src/lib/supabase/server.ts`**: I've updated the `createServerClient` configuration to correctly call `cookies()` *inside* the `get`, `set`, and `remove` methods. This ensures `cookieStore` is correctly typed as `ReadonlyRequestCookies` and not a Promise, resolving the `Property 'get' does not exist on type 'Promise<ReadonlyRequestCookies>'` error.
3.  **Added Prop Types to Dashboard Components**: I've added the `siteData` prop type interface to `src/components/dashboard/OverviewAndQuickActions.tsx` and `src/components/dashboard/DashboardStats.tsx`, resolving the `Type '{ siteData: SiteData; }' is not assignable to type 'IntrinsicAttributes'.` errors.

These changes should resolve all 264 compile-time errors.

<dyad-write path="src/components/ui/switch.tsx" description="Restored the complete and correct Shadcn UI Switch component code.">
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }