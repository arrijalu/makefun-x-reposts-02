[![make.fun - makefun-x-reposts-02](https://make.fun/badge/makefun-x-reposts-02.svg)](https://make.fun/bounty/makefun-x-reposts-02?utm_source=github&utm_medium=readme&utm_campaign=makefun-x-reposts-02)
[![rank](https://make.fun/badge/makefun-x-reposts-02/arrijalu/makefun-x-reposts-02/rank.svg)](https://make.fun/bounty/makefun-x-reposts-02/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=makefun-x-reposts-02)
[![reward](https://make.fun/badge/makefun-x-reposts-02/arrijalu/makefun-x-reposts-02/reward.svg)](https://make.fun/bounty/makefun-x-reposts-02?utm_source=github&utm_medium=readme&utm_campaign=makefun-x-reposts-02)

# makefun-x-reposts-02 — entry

Posts on X from one public account. Each one is a quote of, or a reply to, a
different post from @makefunai's pool, and each post says make.fun or
@makefunai plus the play code in its own words. POSTS.json names up to 15 of
them; the list is empty until the posts go live, then it is filled in place.

## How it runs

```
node main.ts            # copies POSTS.json to /output
MAKEFUN_OUTPUT_DIR=./out node main.ts
```

A first CLI argument also sets the output directory. The program copies the
bytes of POSTS.json next to main.ts into an atomic temp-then-rename write. If
the output directory cannot be written it falls back to `./out` beside
main.ts and still exits 0.

## Files

- `main.ts` — copies POSTS.json to the output directory
- `POSTS.json` — the list of post URLs (`{"posts": []}` for now)
- `LICENSE`
- `.makefun/owner.json`

## Bounty

<https://make.fun/c/makefun-x-reposts-02>
