# Sadu Bay (خليج سدو): one-page game plan

A cozy fishing game where children learn while they fish. Saqr rows a small wooden boat around a calm
Gulf bay, finds fishing spots, casts and reels in, and fills a basket before evening. Every catch
is a tiny lesson: the fish's name in English and Arabic, and a quick question to land it.

There are two versions:
1. **Browser version**: in Sadu now, flat 2D seen from above, works on any phone.
2. **3D version**: Blender plus Unity 6, later, using the same design.

## Camera and feel
- Top-down camera (seen from above), slightly tilted in 3D. Soft, warm colours from Sadu's palette.
- Gentle sea sounds, no timer pressure, no losing. A fish that gets away just swims off; try again.

## The loop
**Row → find a spot → cast → reel → catch card**

1. **Row:** steer the boat with arrows or by tapping where to go.
2. **Find a spot:** bubbles on the water show a fishing spot. Near rocks, the reef and the deep water
   there are different fish. The first visit to each spot shows a **"New fishing spot!"** popup.
3. **Cast:** press and hold, then let go. A power bar decides how far the line goes.
4. **Reel:** a **tension bar**. Keep the marker in the green zone by tapping; too much and the line goes
   slack, too little and the fish escapes. Halfway through, the fish asks a **question** (a sum,
   "which letter does *samak* start with?", or "how many bubbles?"). A right answer lands it.
5. **Catch card:** a picture of the fish, its name in English and Arabic (for example
   **Silver pomfret, زبيدي**), and one fun fact. It goes into the basket.

## Basket, day and night
- An **8-slot basket**, with a counter at the top (**3/8**).
- A **day/night clock**: morning, afternoon, evening. One day is about 4 minutes.
- In the evening Saqr rows back to the dock. A shopkeeper buys the catch, and the child **counts the
  coins**, so the maths fits naturally. Coins buy small boat decorations (a flag, a lantern).

## Fish list (Gulf and Omani sea life)
| Fish | Arabic | Where | Learning |
|---|---|---|---|
| Sardine | عومة | anywhere | counting (small schools) |
| Silver pomfret | زبيدي | open water | sums up to 10 |
| Kingfish | كنعد | deep water | sums up to 20 |
| Grouper | هامور | rocks | letters and sounds |
| Parrotfish | سمكة الببغاء | reef | colours and shapes |
| Crab | سلطعون | near the shore | counting legs |
| Sea turtle (photo only, never caught) | سلحفاة بحرية | reef | kindness: "we watch, we don't catch" |

Questions adapt to the child's age and use Sadu's difficulty levels.

## Interface (added last)
- Basket counter **3/8**, the clock (sun or moon icon), a "New fishing spot!" popup, catch cards
  and button hints ("Hold to cast", "Tap to reel").
- English and Arabic (right to left), big buttons, the sound read aloud for younger children.

## Who does what in the 3D version
- **Blender:** every model and material: the boat, Saqr in a little cap, the dock, the shop, rocks,
  palm trees, the dhow in the distance, and the fish. All exported as .fbx with one shared palette,
  so nothing looks out of place.
- **Unity 6:** the world, the water (a shallow-water look near the shore), fish swimming in schools,
  the camera, the systems and the interface. It is built for the web (WebGL) so it opens inside Sadu.
- **Claude (me):** the modelling scripts in Blender, the C# code in Unity, and setting up the scenes
  in both, connected through each program's MCP plug-in.
- **You and your child:** play it and say what feels wrong. One system is finished before the next
  begins: rowing first, then spots, casting, reeling, the basket, the clock, then the interface.

## What you install for the 3D version (when you are ready)
1. **Blender** (free, blender.org) and **Unity 6** with **WebGL Build Support** (see `unity/README.md`).
2. The Blender MCP add-on and the Unity MCP package. I will find the current versions and guide you
   step by step, then they are connected to Claude Code so I can work inside both programs.

## Order of work
1. The browser version in Sadu: row, spots, cast, reel with questions, catch cards, basket, clock.
2. You play it with your child and tell me what to change.
3. The 3D version: Blender models first, then Unity systems one by one, then the web build in
   `games/sadu-bay/`, opened from Sadu like Falcon Dash.
