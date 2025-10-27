import { forwardRef } from "react";
import { Link } from "react-router-dom";


const buttonStyles = `
.btn {
  /* daisyUI base emulation */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 1rem;
  min-height: 3rem;
  font-size: 0.875rem; /* text-sm */
  line-height: 1.25rem;
  border-radius: 0.5rem; /* rounded-lg */
  border-width: 1px;
  border-style: solid;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-weight: 600; /* font-semibold */
}

/* Base colors - defined for custom classes */
:root {
  --btn-primary: #3b82f6; /* blue-500 */
  --btn-secondary: #f97316; /* orange-500 */
  --btn-success: #10b981; /* emerald-500 */
  --btn-danger: #ef4444; /* red-500 */
  --btn-warning: #facc15; /* yellow-400 */
  --btn-info: #06b6d4; /* cyan-500 */
  --btn-neutral: #6b7280; /* gray-500 */
  --base-content: #1f2937; /* gray-800 */
  --base-100: #ffffff;
  --base-200: #f3f4f6; /* gray-100 */
  --base-300: #e5e7eb; /* gray-200 */
}

/* Variants */
.btn--primary {
  background-color: var(--btn-primary);
  border-color: var(--btn-primary);
  color: white;
}
.btn--primary:hover {
  background-color: #2563eb; /* blue-600 */
  border-color: #2563eb;
}

.btn--secondary {
  background-color: var(--btn-secondary);
  border-color: var(--btn-secondary);
  color: white;
}
.btn--secondary:hover {
  background-color: #ea580c; /* orange-600 */
  border-color: #ea580c;
}

.btn--success {
  background-color: var(--btn-success);
  border-color: var(--btn-success);
  color: white;
}
.btn--success:hover {
  background-color: #059669; /* emerald-600 */
  border-color: #059669;
}

.btn--danger {
  background-color: var(--btn-danger);
  border-color: var(--btn-danger);
  color: white;
}
.btn--danger:hover {
  background-color: #dc2626; /* red-600 */
  border-color: #dc2626;
}

.btn--warning {
  background-color: var(--btn-warning);
  border-color: var(--btn-warning);
  color: var(--base-content);
}
.btn--warning:hover {
  background-color: #eab308; /* yellow-500 */
  border-color: #eab308;
}

.btn--info {
  background-color: var(--btn-info);
  border-color: var(--btn-info);
  color: white;
}
.btn--info:hover {
  background-color: #0891b2; /* cyan-600 */
  border-color: #0891b2;
}

.btn--neutral {
  background-color: var(--btn-neutral);
  border-color: var(--btn-neutral);
  color: white;
}
.btn--neutral:hover {
  background-color: #4b5563; /* gray-600 */
  border-color: #4b5563;
}

.btn--ghost, .btn--link {
  background-color: transparent;
  border-color: transparent;
  color: var(--base-content);
}
.btn--ghost:hover {
  background-color: var(--base-200);
}

.btn--link {
  text-decoration: underline;
  padding-left: 0;
  padding-right: 0;
}
.btn--link:hover {
  text-decoration: none;
}

.btn--outline {
  background-color: transparent;
  color: var(--btn-primary); /* Default to primary outline color */
  border-color: var(--btn-primary);
}
.btn--outline:hover {
  background-color: var(--btn-primary);
  color: white;
}
/* Subtle variant: bg-base-200 border border-base-300 text-base-content hover:bg-base-300 */
.btn--subtle {
  background-color: var(--base-200);
  border-color: var(--base-300);
  color: var(--base-content);
}
.btn--subtle:hover {
  background-color: var(--base-300);
}

/* Icon variant: bg-transparent border-none text-gray-600 hover:bg-gray-200 */
.btn--icon {
  background-color: transparent;
  border-color: transparent;
  color: #4b5563; /* gray-600 */
  padding: 0.5rem; /* adjust padding for icon */
  min-height: auto;
}
.btn--icon:hover {
  background-color: #e5e7eb; /* gray-200 */
}

/* Toggled States */
/* on: bg-blue-600 text-white hover:bg-blue-700 border-transparent */
.btn--toggled-on {
  background-color: #2563eb; /* blue-600 */
  color: white;
  border-color: transparent;
}
.btn--toggled-on:hover {
  background-color: #1d4ed8; /* blue-700 */
}
/* off: bg-white text-blue-500 border-2 border-blue-400 hover:bg-gray-50 */
.btn--toggled-off {
  background-color: white;
  color: #3b82f6; /* blue-500 */
  border-width: 2px;
  border-color: #60a5fa; /* blue-400 */
}
.btn--toggled-off:hover {
  background-color: #f9fafb; /* gray-50 */
}

/* Sizes */
/* btn-xs: height 1.5rem, padding 0 0.5rem, font 0.75rem */
.btn--xs {
  min-height: 1.5rem;
  padding: 0 0.5rem;
  font-size: 0.75rem;
}
/* btn-sm: height 2rem, padding 0 0.8rem, font 0.875rem */
.btn--sm {
  min-height: 2rem;
  padding: 0 0.8rem;
}
/* btn-md: height 3rem (default) */
/* btn-lg: height 4rem, padding 0 1.5rem, font 1.125rem */
.btn--lg {
  min-height: 4rem;
  padding: 0 1.5rem;
  font-size: 1.125rem;
}

/* Utility Classes */
/* block: w-full */
.btn--block {
  width: 100%;
}
/* iconOnly: btn-square */
.btn--icon-only {
  width: 3rem; /* default width for md size */
  height: 3rem;
  padding: 0;
  flex-shrink: 0;
}
/* Adjustments for iconOnly sizes */
.btn--icon-only.btn--xs { width: 1.5rem; height: 1.5rem; }
.btn--icon-only.btn--sm { width: 2rem; height: 2rem; }
.btn--icon-only.btn--lg { width: 4rem; height: 4rem; }

/* Joined (daisyUI join-item) */
.btn--joined {
  border-radius: 0;
  /* Complex to emulate without proper context, keep as basic class */
}

/* Focus: focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 */
.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); /* ring-2, ring-primary/40 */
}

/* Disabled: pointer-events-none */
.btn[disabled], [aria-disabled="true"], .btn--disabled-link {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

/* Polishes */
.btn {
  white-space: nowrap; /* whitespace-nowrap */
}

/* Loading Spinner */
/* loading loading-spinner */
.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  animation: spin 1s ease-in-out infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`;
// --- CSS END ---

// Inject CSS into the document's head (for a functional standalone component)
if (typeof document !== 'undefined') {
  if (!document.getElementById('custom-button-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.setAttribute("id", "custom-button-styles");
    styleSheet.innerText = buttonStyles;
    document.head.appendChild(styleSheet);
  }
}


const intentToVariant = {
  ok: "success",
  cancel: "neutral",
  submit: "primary",
  next: "primary",
  back: "neutral",
  delete: "danger",
  save: "primary",
};

// Simplified maps for generating class names
const variantClassMap = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  success: "btn--success",
  danger: "btn--danger",
  warning: "btn--warning",
  info: "btn--info",
  neutral: "btn--neutral",
  ghost: "btn--ghost",
  outline: "btn--outline",
  link: "btn--link",
  subtle: "btn--subtle",
  icon: "btn--icon",
};

const sizeClassMap = {
  xs: "btn--xs",
  sm: "btn--sm",
  md: "btn--md",
  lg: "btn--lg",
};


const Button = forwardRef(
  (
    {
      intent,
      variant,
      toggled,
      size = "md",
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      loading = false,
      loadingText,
      block = false,
      iconOnly = false,
      joined = false,
      to,
      href,
      type,
      disabled,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    // resolve variant via intent alias
    const resolvedVariant =
      intent && !variant && toggled === undefined
        ? intentToVariant[intent] ?? "primary"
        : variant ?? "primary";

    const Comp = to ? Link : href ? "a" : "button";

    const isDisabled = disabled || loading;

    // dev guard for iconOnly
    if (import.meta?.env?.DEV && iconOnly && !rest["aria-label"]) {
      // eslint-disable-next-line no-console
      console.warn(
        "Button (iconOnly) should include an aria-label for accessibility."
      );
    }

    const content = (
      <>
        {loading ? (
          <span className="loading-spinner" aria-hidden="true" />
        ) : LeftIcon ? (
          <LeftIcon style={{ height: '1rem', width: '1rem' }} aria-hidden="true" />
        ) : null}

        {/* label */}
        {iconOnly ? null : (
          <span style={loading ? { marginLeft: '0.5rem' } : {}}>
            {loading && loadingText ? loadingText : children}
          </span>
        )}

        {/* right icon (not during loading) */}
        {!loading && RightIcon ? (
          <RightIcon
            style={{
              height: '1rem',
              width: '1rem',
              marginLeft: iconOnly ? '0' : '0.5rem' // ml-2
            }}
            aria-hidden="true"
          />
        ) : null}
      </>
    );

    // --- Dynamic Class Construction ---
    const classes = ["btn"];

    // Toggled state overrides variant
    if (toggled !== undefined) {
      classes.push(toggled ? 'btn--toggled-on' : 'btn--toggled-off');
    } else {
      classes.push(variantClassMap[resolvedVariant] || variantClassMap.primary);
    }

    // Size
    classes.push(sizeClassMap[size]);

    // Block
    if (block) classes.push("btn--block");

    // Icon Only
    if (iconOnly) classes.push("btn--icon-only");

    // Joined
    if (joined) classes.push("btn--joined");

    // Add user-provided className at the end
    if (className) classes.push(className);
    
    const buttonClasses = classes.join(" ");
    // --- End Dynamic Class Construction ---

    return (
      <Comp
        ref={ref}
        to={to}
        href={href}
        type={Comp === "button" ? type ?? "button" : undefined}
        disabled={Comp === "button" ? isDisabled : undefined}
        aria-disabled={Comp !== "button" && isDisabled ? true : undefined}
        // Disabled links need an extra class for pointer-events-none if not using the :disabled selector
        className={buttonClasses}
        {...rest}
      >
        {content}
      </Comp>
    );
  }
);

export default Button;