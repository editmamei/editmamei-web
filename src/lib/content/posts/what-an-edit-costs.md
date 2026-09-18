---
title: What an edit costs
description: Editmamei ships no model of its own, so every edit spends tokens from whatever AI you connect to it. Here is what one photo costs, what changes when you carry a template across a whole shoot, and what to do about it before you install.
date: 2026-09-18
---

Editmamei ships no model of its own. It runs on whatever AI client you point at
it, so every edit spends that client's tokens. I had never measured how many, so
in late August I did.

## The setup

Twenty three raw files from a morning at Owasco Lake, shot on a phone. Flat
light, a hazy sky, my dog on a dock. I picked one frame, edited it until I liked
it, and saved the look as a template. Then I ran the same work eight different
ways and recorded what each one spent.

Every run drove Photoshop.

## What one photo costs

Editing a single photo from a plain-language description, with no template,
came to roughly **229,000 tokens** and took about twenty three minutes. That is
the number for starting cold: the model has to look at the picture, decide on a
treatment, try things, check its own work, and change its mind a few times.

The money is not really the point. At pay-as-you-go API rates a run like that is
on the order of a dollar, depending on which model you use. What you feel on a
subscription is different, because a subscription meters you in rate limits
rather than dollars, and a twenty-three minute agent loop is a real bite out of
one. That is the form most people will run into.

Applying a saved template to one photo instead came to about **152,000 tokens**
in seven and a half minutes. A third cheaper, and a third of the time, because
the deciding has already been done.

## What a shoot costs

This is the part I did not expect.

Running the same template across ten photos cost **226,000 tokens** in total.
Not per photo. In total, for all ten. That works out to about **22,600 tokens
each**, roughly a tenth of what the first cold edit cost.

The saving is not linear, and it gets better as the pile gets bigger. Going from
one photo to three, each additional photo added around 32,000 tokens. Going from
three to ten, each additional photo added around 1,500. Once the look is settled
and the rhythm is established, more photos are close to free.

## The last step is different

Cropping the finished set for social is mechanical work, and Photoshop has its
own batch engine for exactly that. Editmamei can drive it.

At three files, using the batch engine was slightly _worse_ than just doing them
one at a time. It has setup costs, and three files is not enough to pay them off.
At ten files it flipped: 15% cheaper and 2.7 times faster, and the cost per extra
file dropped to almost nothing while the one-at-a-time approach kept climbing.

I mention the case where it lost because I nearly published the version where I
only tested three files and concluded the batch engine was not worth much. It is
worth a great deal, at the size it was built for.

## Where it was going

Across every run, 96% of everything the tool sent back was preview images.
Ninety six. Not the edits, not the histograms, not the layer data. The pictures
the model looks at to check its own work.

That matched what the timing already said: checking the work accounts for most
of the wall clock. Looking is more expensive than editing, in both senses.

So I changed it. Since 1.4.0, a result only carries a preview image when you ask
for one, and in a run of several steps only the last step keeps an inline
preview. Every number above was measured before that shipped, which makes them
an upper bound. I have not re-measured yet.

## If you are about to try it

The short version: the first edit is the expensive one, and it is expensive
because the model is deciding. Every edit after that, on the same look, is cheap.

So do not start by pointing it at forty photos. Edit one frame until it is
right, save it as a template, and then carry it across the rest. That is the
order that makes the numbers above work in your favour, and it is the order that
produces a consistent set across a shoot, which is the better reason to do it.

Templates and batch are [Pro features](/pricing). The cold edit — describe what
you want, get layers back — is the free edition.

## The caveat

I ran each of these once. That is enough to see a tenfold difference and a
crossover point, and not enough to publish a precise figure with confidence,
because these runs vary. Treat the shapes as real and the exact numbers as a
first reading. I will run repeats before I put any of this on a pricing page.

If you have edited a photo with Editmamei, I want to know what your first one
cost you — whether 229,000 is normal or whether I picked an unlucky frame.
[Tell me](/contact).

— Alex
