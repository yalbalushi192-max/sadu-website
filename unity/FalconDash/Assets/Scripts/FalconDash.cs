// Sadu: Falcon Dash
// A small maths game for children. Saqr the falcon flies over the desert; a sum appears at the top
// and three gates fly towards him, each with an answer. Steer Saqr into the gate with the right answer.
// Right: +1 point. Wrong: lose a feather (3 feathers). The game gets a little faster as it goes.
//
// How to use: in an empty 2D scene, create an empty GameObject, add this script to it, press Play.
// The script builds everything itself (camera, falcon, gates, text), so no other setup is needed.
// Controls: Up/Down arrow keys or W/S; on a phone or with a mouse, touch or click where Saqr should go.

using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

public class FalconDash : MonoBehaviour
{
    // ---- settings you can change in the Inspector ----
    public int startFeathers = 3;
    public float startSpeed = 3.2f;     // how fast the gates move at the start
    public float speedStep = 0.15f;     // added after every right answer
    public int maxNumber = 10;          // sums use numbers up to this

    // ---- colours from the Sadu website ----
    static readonly Color Sky = new Color32(0x9E, 0xD8, 0xFF, 0xFF);
    static readonly Color Sand = new Color32(0xF2, 0xC7, 0x7B, 0xFF);
    static readonly Color SandDark = new Color32(0xE6, 0xA2, 0x4C, 0xFF);
    static readonly Color Brown = new Color32(0x8B, 0x5E, 0x3C, 0xFF);
    static readonly Color Cream = new Color32(0xF4, 0xE9, 0xD3, 0xFF);
    static readonly Color Red = new Color32(0xB3, 0x26, 0x1E, 0xFF);
    static readonly Color Gold = new Color32(0xFF, 0xC9, 0x3C, 0xFF);
    static readonly Color Ink = new Color32(0x23, 0x20, 0x4A, 0xFF);
    static readonly Color Green = new Color32(0x0B, 0x6B, 0x3A, 0xFF);

    static readonly float[] Lanes = { 2.6f, 0f, -2.6f };   // the three heights a gate can be at

    Font font;
    Transform falcon;
    int lane = 1;                  // 0 top, 1 middle, 2 bottom
    float targetY;
    Text questionText, scoreText, messageText;
    readonly List<Gate> gates = new List<Gate>();
    int score, feathers, rightAnswer;
    float speed;
    bool playing;
    float flash;                   // a short red or green tint after an answer

    class Gate { public Transform t; public int value; public int lane; public bool used; }

    void Start()
    {
        font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        BuildWorld();
        BuildText();
        ShowStart();
    }

    // ---------- building the scene ----------
    void BuildWorld()
    {
        Camera cam = Camera.main;
        if (cam == null) { cam = new GameObject("Main Camera").AddComponent<Camera>(); cam.tag = "MainCamera"; }
        cam.orthographic = true;
        cam.orthographicSize = 5f;
        cam.transform.position = new Vector3(0, 0, -10);
        cam.backgroundColor = Sky;
        cam.clearFlags = CameraClearFlags.SolidColor;

        // dunes along the bottom
        MakeBox("Dune back", new Vector2(0, -5.2f), new Vector2(30, 3f), SandDark, -5);
        MakeBox("Dune front", new Vector2(0, -5.6f), new Vector2(30, 2.4f), Sand, -4);
        // the sun
        MakeCircle("Sun", new Vector2(6.5f, 3.8f), 1.1f, Gold, -6);

        // Saqr: a round brown body, a cream face, eyes, a gold beak and a red Sadu scarf
        falcon = new GameObject("Saqr").transform;
        falcon.position = new Vector3(-5.5f, 0, 0);
        AddPart(falcon, MakeCircle("Body", Vector2.zero, 0.8f, Brown, 2));
        AddPart(falcon, MakeCircle("Face", new Vector2(0.18f, 0.12f), 0.48f, Cream, 3));
        AddPart(falcon, MakeCircle("Eye", new Vector2(0.32f, 0.22f), 0.11f, Ink, 4));
        AddPart(falcon, MakeCircle("Beak", new Vector2(0.62f, 0.02f), 0.16f, Gold, 4));
        AddPart(falcon, MakeBox("Scarf", new Vector2(0.05f, -0.42f), new Vector2(0.9f, 0.16f), Red, 4));
        AddPart(falcon, MakeBox("Wing", new Vector2(-0.45f, -0.05f), new Vector2(0.55f, 0.32f), new Color32(0x6B, 0x44, 0x29, 0xFF), 3));
        targetY = Lanes[lane];
    }

    void BuildText()
    {
        Canvas canvas = new GameObject("Canvas").AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        CanvasScaler scaler = canvas.gameObject.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1280, 720);
        scaler.matchWidthOrHeight = 0.5f;

        questionText = MakeText(canvas.transform, "Question", new Vector2(0.5f, 1f), new Vector2(0, -60), 64, Ink);
        scoreText = MakeText(canvas.transform, "Score", new Vector2(0f, 1f), new Vector2(170, -40), 36, Ink);
        scoreText.alignment = TextAnchor.MiddleLeft;
        messageText = MakeText(canvas.transform, "Message", new Vector2(0.5f, 0.5f), Vector2.zero, 56, Ink);
    }

    // ---------- game flow ----------
    void ShowStart()
    {
        playing = false;
        questionText.text = "";
        messageText.text = "Falcon Dash\n\nFly into the right answer!\nTap or press Space to start";
        UpdateScore();
    }

    void StartGame()
    {
        foreach (Gate g in gates) Destroy(g.t.gameObject);
        gates.Clear();
        score = 0; feathers = startFeathers; speed = startSpeed;
        lane = 1; targetY = Lanes[lane];
        messageText.text = "";
        playing = true;
        NewQuestion();
        UpdateScore();
    }

    void EndGame()
    {
        playing = false;
        questionText.text = "";
        messageText.text = "Well done!\nScore: " + score + "\n\nTap or press Space to play again";
    }

    void NewQuestion()
    {
        int a = Random.Range(1, maxNumber + 1), b = Random.Range(0, maxNumber + 1 - a);
        rightAnswer = a + b;
        questionText.text = a + " + " + b + " = ?";

        // three different answers, one of them right, in random lanes
        List<int> answers = new List<int> { rightAnswer };
        while (answers.Count < 3)
        {
            int wrong = rightAnswer + Random.Range(-3, 4);
            if (wrong >= 0 && !answers.Contains(wrong)) answers.Add(wrong);
        }
        for (int i = answers.Count - 1; i > 0; i--) { int j = Random.Range(0, i + 1); int tmp = answers[i]; answers[i] = answers[j]; answers[j] = tmp; }
        for (int l = 0; l < 3; l++) gates.Add(MakeGate(l, answers[l]));
    }

    void Update()
    {
        bool tapped = PressedStart();
        if (!playing) { if (tapped) StartGame(); return; }

        ReadSteering();
        Vector3 p = falcon.position;
        p.y = Mathf.MoveTowards(p.y, targetY, 12f * Time.deltaTime);
        falcon.position = p;
        falcon.rotation = Quaternion.Euler(0, 0, (targetY - p.y) * 6f);   // tilt while moving

        // move the gates; check them when they reach Saqr
        for (int i = gates.Count - 1; i >= 0; i--)
        {
            Gate g = gates[i];
            g.t.position += Vector3.left * speed * Time.deltaTime;
            if (!g.used && g.t.position.x <= falcon.position.x)
            {
                if (g.lane == lane) Answer(g.value == rightAnswer);
                g.used = true;
            }
            if (g.t.position.x < -11f) { Destroy(g.t.gameObject); gates.RemoveAt(i); }
        }
        // a new question once all gates have passed Saqr
        if (playing && gates.TrueForAll(g => g.used)) NewQuestion();

        if (flash > 0) { flash -= Time.deltaTime; if (flash <= 0) Camera.main.backgroundColor = Sky; }
    }

    void Answer(bool right)
    {
        if (right) { score++; speed += speedStep; Camera.main.backgroundColor = Color.Lerp(Sky, Green, 0.25f); }
        else { feathers--; Camera.main.backgroundColor = Color.Lerp(Sky, Red, 0.25f); }
        flash = 0.25f;
        UpdateScore();
        if (feathers <= 0) EndGame();
    }

    void UpdateScore()
    {
        scoreText.text = "Score: " + score + "    Feathers: " + new string('*', Mathf.Max(0, feathers));
    }

    // ---------- input (works with the old and the new Unity input systems) ----------
    bool PressedStart()
    {
#if ENABLE_INPUT_SYSTEM
        bool key = Keyboard.current != null && Keyboard.current.spaceKey.wasPressedThisFrame;
        bool tap = Pointer.current != null && Pointer.current.press.wasPressedThisFrame;
        return key || tap;
#else
        return Input.GetKeyDown(KeyCode.Space) || Input.GetMouseButtonDown(0);
#endif
    }

    void ReadSteering()
    {
#if ENABLE_INPUT_SYSTEM
        if (Keyboard.current != null)
        {
            if (Keyboard.current.upArrowKey.wasPressedThisFrame || Keyboard.current.wKey.wasPressedThisFrame) lane = Mathf.Max(0, lane - 1);
            if (Keyboard.current.downArrowKey.wasPressedThisFrame || Keyboard.current.sKey.wasPressedThisFrame) lane = Mathf.Min(2, lane + 1);
        }
        if (Pointer.current != null && Pointer.current.press.isPressed) lane = LaneAtScreenY(Pointer.current.position.ReadValue().y);
#else
        if (Input.GetKeyDown(KeyCode.UpArrow) || Input.GetKeyDown(KeyCode.W)) lane = Mathf.Max(0, lane - 1);
        if (Input.GetKeyDown(KeyCode.DownArrow) || Input.GetKeyDown(KeyCode.S)) lane = Mathf.Min(2, lane + 1);
        if (Input.GetMouseButton(0)) lane = LaneAtScreenY(Input.mousePosition.y);
#endif
        targetY = Lanes[lane];
    }

    int LaneAtScreenY(float screenY)
    {
        float worldY = Camera.main.ScreenToWorldPoint(new Vector3(0, screenY, 10)).y;
        if (worldY > 1.3f) return 0;
        if (worldY < -1.3f) return 2;
        return 1;
    }

    // ---------- small helpers that make shapes and text ----------
    Gate MakeGate(int l, int value)
    {
        Transform t = new GameObject("Gate " + value).transform;
        t.position = new Vector3(10f, Lanes[l], 0);
        AddPart(t, MakeBox("Post top", new Vector2(0, 0.95f), new Vector2(1.5f, 0.22f), Red, 5));
        AddPart(t, MakeBox("Post bottom", new Vector2(0, -0.95f), new Vector2(1.5f, 0.22f), Red, 5));
        AddPart(t, MakeCircle("Sign", Vector2.zero, 0.75f, Color.white, 5));

        GameObject label = new GameObject("Number");
        label.transform.SetParent(t, false);
        TextMesh tm = label.AddComponent<TextMesh>();
        tm.font = font;
        tm.text = value.ToString();
        tm.fontSize = 80;
        tm.characterSize = 0.08f;
        tm.anchor = TextAnchor.MiddleCenter;
        tm.alignment = TextAlignment.Center;
        tm.color = Ink;
        MeshRenderer mr = label.GetComponent<MeshRenderer>();
        mr.material = font.material;
        mr.sortingOrder = 6;
        return new Gate { t = t, value = value, lane = l };
    }

    static void AddPart(Transform parent, GameObject part)
    {
        Vector3 local = part.transform.position;
        part.transform.SetParent(parent, false);
        part.transform.localPosition = local;
    }

    static Sprite square, circle;

    static GameObject MakeBox(string name, Vector2 pos, Vector2 size, Color color, int order)
    {
        if (square == null) square = MakeSprite(false);
        GameObject go = new GameObject(name);
        go.transform.position = pos;
        go.transform.localScale = new Vector3(size.x, size.y, 1);
        SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
        sr.sprite = square; sr.color = color; sr.sortingOrder = order;
        return go;
    }

    static GameObject MakeCircle(string name, Vector2 pos, float radius, Color color, int order)
    {
        if (circle == null) circle = MakeSprite(true);
        GameObject go = new GameObject(name);
        go.transform.position = pos;
        go.transform.localScale = new Vector3(radius * 2, radius * 2, 1);
        SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
        sr.sprite = circle; sr.color = color; sr.sortingOrder = order;
        return go;
    }

    // a 64 x 64 white square or circle, tinted by each SpriteRenderer's colour
    static Sprite MakeSprite(bool round)
    {
        const int n = 64;
        Texture2D tex = new Texture2D(n, n, TextureFormat.RGBA32, false);
        tex.filterMode = FilterMode.Bilinear;
        Color[] px = new Color[n * n];
        for (int y = 0; y < n; y++)
            for (int x = 0; x < n; x++)
            {
                float dx = x - n / 2f + 0.5f, dy = y - n / 2f + 0.5f;
                float a = round ? Mathf.Clamp01(n / 2f - Mathf.Sqrt(dx * dx + dy * dy)) : 1f;
                px[y * n + x] = new Color(1, 1, 1, a);
            }
        tex.SetPixels(px);
        tex.Apply();
        return Sprite.Create(tex, new Rect(0, 0, n, n), new Vector2(0.5f, 0.5f), n);
    }

    Text MakeText(Transform parent, string name, Vector2 anchor, Vector2 offset, int size, Color color)
    {
        GameObject go = new GameObject(name);
        go.transform.SetParent(parent, false);
        Text t = go.AddComponent<Text>();
        t.font = font;
        t.fontSize = size;
        t.fontStyle = FontStyle.Bold;
        t.color = color;
        t.alignment = TextAnchor.MiddleCenter;
        t.horizontalOverflow = HorizontalWrapMode.Overflow;
        t.verticalOverflow = VerticalWrapMode.Overflow;
        RectTransform rt = t.rectTransform;
        rt.anchorMin = rt.anchorMax = anchor;
        rt.anchoredPosition = offset;
        rt.sizeDelta = new Vector2(900, 200);
        return t;
    }
}
