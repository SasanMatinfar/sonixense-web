const waves = [
  { d: "M5 182C88 16 212 24 301 139C391 255 463 294 532 281C605 267 671 171 790 118", family: "structure", depth: "far" },
  { d: "M72 230C143 82 245 78 323 165C401 253 459 292 532 286C619 279 676 213 748 189", family: "structure", depth: "far" },
  { d: "M18 286C127 194 202 120 302 193C381 250 447 299 529 294C633 288 707 250 792 246", family: "structure", depth: "far" },
  { d: "M42 421C151 341 221 255 327 270C414 282 458 316 529 309C625 300 711 340 774 361", family: "structure", depth: "far" },
  { d: "M8 507C143 460 256 329 370 342C449 351 481 329 536 322C631 310 695 392 734 438", family: "structure", depth: "far" },
  { d: "M112 552C211 497 302 407 398 402C476 398 507 352 559 337C624 318 675 381 716 471", family: "data", depth: "far" },
  { d: "M18 210C105 75 216 72 309 165C392 247 453 286 530 286C626 286 708 196 790 166", family: "clarity", depth: "mid" },
  { d: "M86 261C154 139 238 112 319 188C397 260 458 292 531 292C621 292 684 249 754 224", family: "structure", depth: "mid" },
  { d: "M18 315C116 234 211 148 317 208C401 256 458 298 531 298C628 298 715 276 790 270", family: "perception", depth: "mid" },
  { d: "M54 365C143 280 228 194 328 234C411 267 463 304 532 304C620 304 677 302 752 319", family: "structure", depth: "mid" },
  { d: "M16 443C129 393 230 251 348 282C426 302 471 312 533 311C628 309 717 351 790 379", family: "perception", depth: "mid" },
  { d: "M128 472C218 394 285 306 373 316C448 325 484 319 536 316C618 312 674 357 742 402", family: "clarity", depth: "mid" },
  { d: "M104 110C206 38 290 68 362 151C428 228 475 276 531 281C607 287 655 224 704 157", family: "data", depth: "mid" },
  { d: "M28 337C123 257 222 164 326 217C411 261 466 300 532 301C615 303 682 267 782 255", family: "signal", depth: "near", ridge: "primary" },
  { d: "M62 373C153 278 243 218 337 249C414 275 466 306 532 306C601 306 635 291 679 291C723 292 755 318 780 341", family: "perception", depth: "near", ridge: "secondary" },
  { d: "M118 402C201 318 275 260 358 276C430 290 476 311 535 311C609 311 668 327 750 363", family: "clarity", depth: "near", ridge: "support" },
  { d: "M56 82C181 7 285 49 378 143C447 213 489 271 536 278C596 286 635 226 674 138", family: "data", depth: "far" },
  { d: "M178 535C266 462 339 386 414 379C476 373 507 338 553 328C615 315 651 355 686 431", family: "data", depth: "far" },
] as const;

const crossWaves = [
  "M206 512C309 454 359 364 430 299C493 242 572 209 699 165",
  "M254 538C342 464 381 377 448 315C511 257 586 231 742 210",
  "M324 524C386 453 414 384 470 329C527 273 598 253 771 250",
] as const;

const ribbonBundles = [
  { d: "M38 287C132 211 225 160 324 215C411 264 466 298 531 300C618 302 695 274 776 254", family: "teal", level: "outer" },
  { d: "M54 296C144 218 233 168 329 220C413 266 468 299 531 301C615 303 687 280 764 263", family: "teal", level: "outer" },
  { d: "M71 304C155 228 242 176 333 225C415 269 470 301 532 302C611 303 678 285 752 272", family: "pink", level: "outer" },
  { d: "M86 311C166 237 249 185 337 230C418 271 472 302 532 303C608 304 670 289 741 279", family: "teal", level: "mid" },
  { d: "M101 317C178 247 258 193 342 235C421 274 474 303 533 304C604 305 662 293 730 286", family: "white", level: "mid" },
  { d: "M117 323C189 257 267 203 347 240C424 276 476 304 533 305C601 306 655 296 721 292", family: "teal", level: "mid" },
  { d: "M132 328C200 267 276 212 352 245C427 278 478 305 533 306C598 307 648 299 713 297", family: "pink", level: "inner" },
  { d: "M147 333C211 277 284 222 357 250C430 281 480 306 534 307C595 308 642 301 705 302", family: "teal", level: "inner" },
  { d: "M162 338C222 287 293 232 362 256C433 283 482 307 534 308C592 309 636 304 698 307", family: "white", level: "inner" },
  { d: "M176 343C233 297 302 242 368 262C436 286 484 308 535 309C589 310 631 307 692 312", family: "teal", level: "inner" },
  { d: "M190 348C244 307 311 253 374 268C439 289 486 309 535 310C587 311 626 310 687 317", family: "pink", level: "mid" },
  { d: "M204 354C255 317 320 264 380 274C442 292 488 310 536 311C584 312 621 313 682 322", family: "teal", level: "outer" },
  { d: "M32 353C126 273 223 191 326 231C411 264 465 303 531 305C618 307 697 316 778 346", family: "teal", level: "outer" },
  { d: "M51 361C141 280 235 201 333 238C415 269 468 304 532 306C614 308 688 319 766 350", family: "teal", level: "outer" },
  { d: "M69 369C156 288 247 211 340 245C419 274 471 305 532 307C610 309 679 322 754 354", family: "pink", level: "outer" },
  { d: "M88 377C172 296 259 221 347 252C423 278 474 307 533 308C606 310 670 325 743 358", family: "teal", level: "mid" },
  { d: "M107 385C188 305 271 232 354 259C427 283 477 308 533 309C602 311 662 328 732 362", family: "white", level: "mid" },
  { d: "M126 393C204 314 283 243 361 266C431 287 480 309 534 310C598 312 654 331 721 366", family: "teal", level: "mid" },
  { d: "M146 401C220 323 295 254 368 273C435 291 483 310 534 311C594 313 646 334 710 370", family: "pink", level: "inner" },
  { d: "M166 409C236 333 307 266 375 280C439 296 486 312 535 312C590 314 638 337 699 374", family: "teal", level: "inner" },
  { d: "M187 417C252 343 319 278 382 287C443 300 489 313 535 313C586 315 630 340 688 378", family: "white", level: "mid" },
  { d: "M208 425C268 353 331 290 389 294C447 304 492 314 536 314C582 316 622 343 677 382", family: "teal", level: "outer" },
] as const;

export default function SonicWaveField() {
  return (
    <div className="hero-wave-field" aria-hidden="true">
      <svg viewBox="0 0 800 620" role="presentation">
        <defs>
          <linearGradient id="wave-fade" x1="0" x2="1">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset=".12" stopColor="white" />
            <stop offset=".88" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="wave-edge-fade"><rect width="800" height="620" fill="url(#wave-fade)" /></mask>
          <radialGradient id="wave-coherence">
            <stop offset="0" stopColor="var(--color-perception)" stopOpacity=".13" />
            <stop offset="1" stopColor="var(--color-perception)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="620" cy="306" rx="175" ry="210" fill="url(#wave-coherence)" />
        <g className="hero-wave-field__waves" fill="none" mask="url(#wave-edge-fade)" strokeLinecap="round">
          {waves.map((wave, index) => <path key={index} className={`hero-wave-field__strand hero-wave-field__strand--${wave.family} hero-wave-field__strand--${wave.depth}${"ridge" in wave ? ` hero-wave-field__ridge--${wave.ridge}` : ""}`} d={wave.d} />)}
        </g>
        <g className="hero-wave-field__ribbon" fill="none" mask="url(#wave-edge-fade)" strokeLinecap="round">
          {ribbonBundles.map((strand, index) => <path key={index} className={`hero-wave-field__bundle hero-wave-field__bundle--${strand.family} hero-wave-field__bundle--${strand.level}`} d={strand.d} />)}
        </g>
        <g className="hero-wave-field__crossflow" fill="none" mask="url(#wave-edge-fade)" stroke="var(--color-structure)" strokeLinecap="round">
          {crossWaves.map((d, index) => <path key={index} d={d} />)}
        </g>
        <g className="hero-wave-field__data" fill="var(--color-action)">
          <circle cx="185" cy="209" r="3.2" /><circle cx="327" cy="217" r="2.4" /><circle cx="466" cy="300" r="4.3" /><circle cx="614" cy="303" r="2.6" /><circle cx="714" cy="265" r="3.4" />
        </g>
        <g className="hero-wave-field__particles" fill="var(--color-perception)">
          <circle cx="115" cy="426" r="1.35" /><circle cx="283" cy="129" r="1.2" /><circle cx="404" cy="356" r="1.6" /><circle cx="570" cy="215" r="1.2" /><circle cx="688" cy="395" r="1.35" />
        </g>
        <g className="hero-wave-field__sequence" fill="var(--color-foreground)" opacity=".34">
          <circle cx="522" cy="254" r="1.4" /><circle cx="536" cy="259" r="1.4" /><circle cx="550" cy="264" r="1.4" /><circle cx="564" cy="269" r="1.4" /><circle cx="578" cy="274" r="1.4" />
        </g>
      </svg>
    </div>
  );
}
