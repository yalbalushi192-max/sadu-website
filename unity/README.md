# Sadu games in Unity: Falcon Dash

**Falcon Dash:** Saqr flies over the desert. A sum appears at the top (for example `4 + 3 = ?`) and
three gates fly towards him, each with a number. The child steers Saqr into the gate with the right
answer. Right answers score points, wrong ones lose a feather (3 feathers), and the game slowly gets faster.

- Keyboard: Up/Down arrows (or W/S), Space to start.
- Phone, tablet or mouse: touch or click where Saqr should fly (top, middle or bottom).

All the game is in one file: `FalconDash/Assets/Scripts/FalconDash.cs`. It builds the whole scene
itself (sky, dunes, sun, Saqr, gates and text), so there is almost nothing to set up by hand.

---

## Part 1: install Unity (once, about 30 minutes, mostly waiting)

1. Download **Unity Hub** from **unity.com/download** and install it.
2. Open Unity Hub and sign in (create a free Unity account if you do not have one; choose the free
   **Personal** licence when asked).
3. In Unity Hub go to **Installs → Install Editor**, choose **Unity 6 (LTS)**.
4. On the next screen tick **WebGL Build Support** (this is what makes the game run in a browser).
   You can untick the other platforms to save space. Press **Install**.

## Part 2: make the project (about 5 minutes)

1. In Unity Hub: **Projects → New project**, choose the **Universal 2D** (or **2D**) template.
2. Name it **FalconDash**, and save it anywhere you like (for example your Desktop). Press **Create project**.
3. When Unity opens, in the **Project** panel at the bottom, right-click **Assets → Create → Folder**, name it **Scripts**.
4. Copy the file `FalconDash.cs` from this folder
   (`sadu-website\unity\FalconDash\Assets\Scripts\FalconDash.cs`) into that **Scripts** folder
   (you can drag it from Windows File Explorer straight into the Scripts folder in Unity).
5. In the **Hierarchy** panel (top left), right-click → **Create Empty**. A "GameObject" appears.
6. Drag `FalconDash` from the Scripts folder onto that GameObject.
7. Press the **Play** button (▶) at the top. The game should start in the Game window.
   Press Space or click to begin.

**If you see red error messages at the bottom (the Console), copy them and send them to me.** I could
not test this code inside Unity, so the first try may need a small fix.

## Part 3: build it for the website

1. **File → Build Profiles** (in older versions: **File → Build Settings**).
2. Choose **Web** (or **WebGL**) and press **Switch Platform**. Wait for it to finish.
3. Press **Player Settings…** and open **Publishing Settings**:
   - **Compression Format: Disabled** (GitHub Pages cannot serve compressed Unity files without extra setup).
4. Close the settings, press **Build**, and choose this folder as the build location:
   `C:\Users\Dell\OneDrive\Desktop\Claude Projects\sadu-website\games\falcon-dash`
   (create the `games` and `falcon-dash` folders if they do not exist).
5. When the build finishes, tell me **"Falcon Dash is built"**. I will then:
   - add a **Falcon Dash** button to the Sadu games,
   - check it opens on a phone and a computer,
   - and save it, so it goes online with the rest of Sadu.

## Things to know

- A Unity web game is much bigger than the rest of Sadu (often 10 to 30 MB), so the first load on a
  phone takes a little time. After that the browser keeps a copy.
- The game uses only numbers, because Unity cannot show Arabic letters correctly without an extra
  plug-in. Arabic text can come later if needed.
- Settings you can change without coding: click the GameObject with the script and change **Start Feathers**,
  **Start Speed**, **Speed Step** or **Max Number** in the Inspector on the right.
