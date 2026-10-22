<p align="center"><img src="docs/banner.png" alt="영상 비율 검사: 업로드 전에 화면에 보이는 비율로 확인합니다" width="100%"></p>

<p align="center">
<a href="https://github.com/reedodev/social-video-gate/actions/workflows/test.yml"><img src="https://github.com/reedodev/social-video-gate/actions/workflows/test.yml/badge.svg" alt="test"></a>
<img src="https://img.shields.io/badge/Claude_Code-skill-2547F4" alt="Claude Code skill">
<img src="https://img.shields.io/badge/license-MIT-black" alt="MIT">
</p>

# 영상 비율 검사 (social-video-gate)

릴스·쇼츠·틱톡·유튜브에 올릴 영상의 비율을 파일 숫자가 아니라 화면에 실제로 보이는 크기로 계산합니다. 휴대폰 영상의 회전 정보와 정사각형이 아닌 픽셀까지 반영하고, 맞지 않으면 업로드 전에 멈춥니다.

## 처음 쓰시는 분을 위한 안내

### 이 스킬이 해결하는 문제

영상을 만들어 올렸는데 릴스에서 위아래가 검게 비어 있거나, 분명 세로로 찍었는데 옆으로 누워 보이거나, 사람 얼굴이 길쭉하게 늘어나는 일이 있습니다. 파일 속 숫자는 멀쩡해 보여도 "90도 돌려서 보여 달라"는 표시나 "픽셀이 정사각형이 아니다"라는 표시가 숨어 있을 때 생깁니다. 이 스킬은 영상을 올리기 **전에** 화면에 실제로 보이는 크기와 비율을 계산해서, 맞지 않으면 그 자리에서 멈춥니다.

- 상황 1: AI 에이전트가 영상을 만들어 인스타그램 릴스에 올리려는데, 가로 영상(16:9)이 섞여 들어간 경우
- 상황 2: 휴대폰으로 찍은 영상이 편집 뒤에도 회전 표시를 달고 있어서, 올린 뒤에야 옆으로 누워 있는 것을 알게 되는 경우

### 용어 풀이

- **Claude Code**: 터미널에서 대화하듯 일을 시키는 AI 코딩 도우미입니다. 이 스킬은 Claude Code가 읽고 따르는 용도로 만들었습니다.
- **스킬**: 에이전트가 읽고 그대로 따르는 사용 설명서(`SKILL.md`)와 실행 도구를 한 폴더로 묶은 것입니다.
- **터미널**: 명령어를 글자로 입력하는 창입니다. Windows에서는 PowerShell, Mac에서는 "터미널" 앱입니다.
- **ffprobe**: 영상 파일의 크기·회전·길이 같은 정보를 읽어 주는 작은 프로그램입니다. FFmpeg라는 영상 도구에 함께 들어 있습니다.
- **종료 코드**: 프로그램이 끝날 때 남기는 숫자입니다. 0이면 통과, 1이면 검사 실패, 2면 사용법이나 환경 문제입니다.

### 준비 확인

터미널에서 아래 두 줄을 입력해 숫자와 버전이 나오는지 봅니다.

```bash
node -v
ffprobe -version
```

- `node -v`는 `v18` 이상이면 됩니다. 명령을 찾을 수 없다고 나오면 [nodejs.org](https://nodejs.org)에서 LTS 버전을 설치합니다.
- `ffprobe -version` 첫 줄에 `ffprobe version ...`이 나와야 합니다. 없으면 FFmpeg를 설치합니다.
  - Windows: `winget install Gyan.FFmpeg`
  - Mac: `brew install ffmpeg` (Homebrew가 필요합니다. [brew.sh](https://brew.sh))
  - 설치한 뒤에는 터미널을 닫았다가 다시 열어야 새 명령이 인식됩니다.

### 따라 하기 3단계

**1단계. 설치합니다.** Claude Code 안에서 아래 두 줄을 차례로 입력합니다.

```
/plugin marketplace add reedodev/social-video-gate
/plugin install social-video-gate@social-video-gate
```

**2단계. 에이전트에게 이렇게 말합니다.** 아래 문장을 그대로 복사해 쓰시면 됩니다.

1. `final.mp4를 인스타 릴스에 올리기 전에 social-video-gate로 비율을 검사해 줘.`
2. `이 영상이 유튜브 쇼츠 규격에 맞는지 확인하고, 안 맞으면 어디가 문제인지 알려 줘.`
3. `인스타 피드용 4:5 영상이야. 비율과 크기를 검사해 줘.`

**3단계. 결과를 확인합니다.** `PASS`가 나오면 기술 검사 통과이고, `FAIL`이 나오면 올리지 않습니다. PASS여도 실제 업로드 미리보기를 한 번은 눈으로 봅니다.

직접 실행해 보고 싶으시면 먼저 연습용 영상 두 개를 만듭니다(FFmpeg의 `ffmpeg`가 함께 설치됩니다).

```bash
ffmpeg -f lavfi -i "color=c=0x2547F4:s=1080x1920:r=30:d=2" -f lavfi -i "sine=f=440:d=2" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest sample-vertical.mp4
ffmpeg -f lavfi -i "color=c=0x2547F4:s=1920x1080:r=30:d=2" -f lavfi -i "sine=f=440:d=2" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest sample-wide.mp4
```

### 실제로 실행한 결과

세로 영상을 릴스 기준으로 검사한 결과입니다.

```
$ node skills/social-video-gate/scripts/video-gate.mjs sample-vertical.mp4 --target reels
PASS  sample-vertical.mp4 -> Instagram Reels (9:16)
  표시 1080x1920 | 인코딩 1080x1920 | 회전 0 | SAR 1:1 | 2s | 30fps | h264/yuv420p | 소리 aac
  Technical check only. Look at the real upload preview too. 기술 검사만 통과한 것이니 실제 업로드 미리보기도 눈으로 확인하세요.
```

같은 릴스 기준으로 가로 영상을 검사하면 멈춥니다.

```
$ node skills/social-video-gate/scripts/video-gate.mjs sample-wide.mp4 --target reels
FAIL  sample-wide.mp4 -> Instagram Reels (9:16)
  표시 1920x1080 | 인코딩 1920x1080 | 회전 0 | SAR 1:1 | 2s | 30fps | h264/yuv420p | 소리 aac
  X 화면에 보이는 크기가 1920x1080(가로 영상)이어서 Instagram Reels에 필요한 비율 9:16에 맞지 않습니다.
    Display size 1920x1080 does not match the 9:16 required for Instagram Reels.
  Technical check only. Look at the real upload preview too. 기술 검사만 통과한 것이니 실제 업로드 미리보기도 눈으로 확인하세요.
```

읽는 법: 첫 줄의 `PASS`/`FAIL`이 결론입니다. "표시"는 시청자가 보는 크기이고 "인코딩"은 파일에 저장된 크기인데, 둘이 다르면 회전 표시나 SAR(픽셀 모양) 때문입니다. `X`로 시작하는 줄은 멈춰야 하는 이유이고, `!`로 시작하는 줄은 멈추지는 않지만 확인해 볼 경고입니다.

### 막힐 때

아래는 모두 직접 재현해 본 증상입니다.

| 증상 | 원인 | 해결 |
|---|---|---|
| `ffprobe failed: spawnSync ffprobe ENOENT` 와 `(Install FFmpeg or set FFPROBE_PATH.)` (종료 코드 2) | 컴퓨터에서 `ffprobe`를 찾지 못했습니다. FFmpeg가 없거나 PATH에 없습니다. | 위 "준비 확인"대로 FFmpeg를 설치하고 터미널을 다시 엽니다. 설치 위치를 알면 `FFPROBE_PATH` 환경변수에 `ffprobe` 파일 전체 경로를 적습니다. |
| `ffprobe failed: spawnSync C:\nope\ffprobe.exe ENOENT` | `FFPROBE_PATH`에 적은 경로에 파일이 없습니다. | 경로의 오타를 고치거나, 환경변수를 지우고 PATH에 있는 `ffprobe`를 쓰게 합니다. |
| `file not found: nofile.mp4` (종료 코드 2) | 영상 파일 이름이나 폴더가 틀렸습니다. | `ls`(Mac) 또는 `dir`(Windows)로 파일이 있는 폴더에서 실행하는지 확인합니다. |
| `usage: node video-gate.mjs <video> --target ...` (종료 코드 2) | `--target`을 빼먹었거나 `--target insta`처럼 없는 이름을 썼습니다. | `reels`, `shorts`, `tiktok`, `youtube`, `threads-landscape`, `square` 중 하나를 쓰거나 `--ratio 4:5`처럼 직접 지정합니다. |
| `ffprobe failed: ... moov atom not found` 와 `Invalid data found` (종료 코드 2) | 영상이 아닌 파일이거나, 내보내기가 중간에 끊겨 망가진 파일입니다. | 편집 프로그램에서 다시 내보낸 뒤 검사합니다. |
| `FAIL` 과 `X 화면에 보이는 크기가 ...(가로 영상)...` (종료 코드 1) | 영상 비율이 대상과 다릅니다. | 올릴 곳에 맞는 비율로 다시 편집합니다. 억지로 늘리지 말고 잘라 내거나 여백을 넣습니다. |
| `X 픽셀이 정사각형이 아닙니다(SAR 2:1)` (종료 코드 1) | 픽셀 모양 정보가 정사각형이 아니어서 업로드 뒤 화면이 늘어날 수 있습니다. | `ffmpeg -i in.mp4 -vf "scale=1080:1920,setsar=1" -c:a copy out.mp4`로 다시 만듭니다. |
| `! 권장 해상도 1080x1920보다 작습니다.` 와 `! 소리 트랙이 없습니다` | 경고입니다. 통과는 했지만 화질이 낮거나 소리가 없습니다. | 의도한 것이면 그대로 올려도 됩니다. 아니면 다시 내보냅니다. |

<!-- prereq-adapt -->
## 무엇이 필요한가요?

꼭 필요한 것은 Node 18 이상, FFmpeg의 `ffprobe`, 올릴 최종 영상 파일, 업로드 화면의 미리보기입니다. 권장·선택 준비물까지 정리한 표는 [SKILL.md의 준비물](skills/social-video-gate/SKILL.md#준비물-쓰기-전에-있어야-하는-것)에 있습니다.

## 바꿔 쓰기

에이전트에게 다음처럼 말하면 옵션을 바꿔서 실행합니다.

- "인스타 피드용 4:5 영상이야" → `--ratio 4:5` (최소 크기는 `--min 1080x1350`)
- "우리 채널은 1080x1920만 받아" → `--target reels --min 1080x1920`
- "권장 해상도 경고 기준을 바꿔 줘" → `--rec 1440x2560`

말과 옵션의 대응표는 [SKILL.md의 바꿔 쓰기](skills/social-video-gate/SKILL.md#바꿔-쓰기-이렇게-말하세요)에 있습니다.

## 설치

**Claude Code 플러그인으로 설치**

```
/plugin marketplace add reedodev/social-video-gate
/plugin install social-video-gate@social-video-gate
```

**폴더만 복사**

```bash
git clone https://github.com/reedodev/social-video-gate.git
cp -r social-video-gate/skills/social-video-gate ~/.claude/skills/
```

필요한 것: Node 18+, ffprobe(FFmpeg)

## 바로 해 보기

내 영상이 `final.mp4`라면 이렇게 실행합니다. 영상이 아직 없다면 위 "따라 하기 3단계"의 연습용 영상 만들기를 먼저 하고, 파일 이름을 `sample-vertical.mp4`로 바꿔서 실행합니다.

```bash
node skills/social-video-gate/scripts/video-gate.mjs final.mp4 --target reels
```

자세한 절차, 옵션, 한계는 [SKILL.md](skills/social-video-gate/SKILL.md)에 있습니다. 에이전트가 이 파일을 읽고 그대로 따릅니다.

## 시험

`node tests/run.mjs`가 SKILL.md 형식을 검사하고 예시 파일로 스크립트를 실제로 실행합니다. 푸시할 때마다 GitHub Actions가 같은 시험을 돌립니다(위 test 배지).

<!-- credits -->
## 출처와 영감

- **영상 정보 읽기**: [FFmpeg의 ffprobe](https://ffmpeg.org/ffprobe.html)를 불러 씁니다. FFmpeg는 따로 설치하며 그 라이선스를 따릅니다.
- **비율과 해상도 기준**: 9:16, 16:9, 1:1과 최소·권장 해상도는 각 플랫폼이 널리 안내하는 값을 작성자가 정리한 것이고, 플랫폼 정책은 바뀔 수 있습니다. 올리기 전에 해당 플랫폼의 최신 도움말과 실제 업로드 미리보기를 확인합니다.

## 만든 사람

**리도**, AI 좌충우돌 실습 중인 20년차 엔지니어입니다. 매일 AI에게 일을 맡기다가 막힌 부분을 고쳐 가며 이 스킬을 만들었습니다.
[YouTube @Reedodev](https://www.youtube.com/@Reedodev) · [Threads @reedo.dev](https://www.threads.com/@reedo.dev) · [GitHub @reedodev](https://github.com/reedodev)

같이 만든 다른 스킬: [옵시디언 3D 지식그래프](https://github.com/reedodev/obsidian-brain-3d) · [노트 먼저 찾아보기](https://github.com/reedodev/vault-recall) · [작업 기록 강의자료](https://github.com/reedodev/work-to-lecture-deck) · [한국어 말투 점검](https://github.com/reedodev/korean-tone-check) · [네이버 황금키워드](https://github.com/reedodev/naver-golden-keywords) · [한글 양식 채우기](https://github.com/reedodev/hwpx-form-fill) · [TTS 끝소리 고치기](https://github.com/reedodev/tts-tail-fix) · [카드뉴스 렌더](https://github.com/reedodev/html-card-render) · [유튜브 게시 점검](https://github.com/reedodev/youtube-publish-checklist) · [설명 영상 만들기](https://github.com/reedodev/explainer-studio)

---

## English

Check the displayed aspect ratio of a video (rotation metadata and non-square pixels included) for Reels, Shorts, TikTok, YouTube or square, and fail before upload on mismatch.

### New here? A guide for first-time users

**What problem it solves.** You upload a video to Reels or Shorts and it has black bars, lies on its side, or makes faces look stretched. The numbers inside the file can look fine while a hidden "rotate by 90 degrees" flag or a non-square pixel shape changes what viewers actually see. This skill works out the size people really see, **before** you upload, and stops if it does not match.

- Case 1: an AI agent builds a video for Instagram Reels, but a landscape (16:9) file slips in.
- Case 2: a phone video still carries a rotation flag after editing, and you only notice it lying sideways after posting.

**Glossary.**
- **Claude Code**: an AI coding assistant you talk to in a terminal. This skill is written for Claude Code to read and follow.
- **Skill**: a folder with instructions (`SKILL.md`) and tools that an agent reads and follows exactly.
- **Terminal**: a window where you type commands. PowerShell on Windows, the Terminal app on Mac.
- **ffprobe**: a small program that reads facts about a video file (size, rotation, length). It ships with FFmpeg.
- **Exit code**: a number a program leaves when it ends. 0 means pass, 1 means the check failed, 2 means a usage or setup problem.

**Check your setup.** Run these two lines in a terminal.

```bash
node -v
ffprobe -version
```

- `node -v` should print `v18` or higher. If the command is not found, install the LTS version from [nodejs.org](https://nodejs.org).
- `ffprobe -version` should print `ffprobe version ...` on its first line. If not, install FFmpeg:
  - Windows: `winget install Gyan.FFmpeg`
  - Mac: `brew install ffmpeg` (needs Homebrew, see [brew.sh](https://brew.sh))
  - Close and reopen the terminal afterwards so the new command is found.

**Three steps.**

1. **Install.** Inside Claude Code, enter these two lines one after the other.

   ```
   /plugin marketplace add reedodev/social-video-gate
   /plugin install social-video-gate@social-video-gate
   ```

2. **Ask your agent.** Copy any of these sentences.

   1. `Before uploading final.mp4 to Instagram Reels, check its aspect ratio with social-video-gate.`
   2. `Check whether this video fits YouTube Shorts, and if not, tell me what is wrong.`
   3. `This is a 4:5 video for an Instagram feed post. Check its ratio and size.`

3. **Read the result.** `PASS` means the technical check passed. `FAIL` means do not upload. Even after PASS, look at the platform's real upload preview once.

To try it yourself first, create two practice videos (the `ffmpeg` command is installed together with FFmpeg).

```bash
ffmpeg -f lavfi -i "color=c=0x2547F4:s=1080x1920:r=30:d=2" -f lavfi -i "sine=f=440:d=2" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest sample-vertical.mp4
ffmpeg -f lavfi -i "color=c=0x2547F4:s=1920x1080:r=30:d=2" -f lavfi -i "sine=f=440:d=2" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest sample-wide.mp4
```

**Real output.** The vertical video checked for Reels:

```
$ node skills/social-video-gate/scripts/video-gate.mjs sample-vertical.mp4 --target reels
PASS  sample-vertical.mp4 -> Instagram Reels (9:16)
  표시 1080x1920 | 인코딩 1080x1920 | 회전 0 | SAR 1:1 | 2s | 30fps | h264/yuv420p | 소리 aac
  Technical check only. Look at the real upload preview too. 기술 검사만 통과한 것이니 실제 업로드 미리보기도 눈으로 확인하세요.
```

The landscape video checked for Reels is stopped:

```
$ node skills/social-video-gate/scripts/video-gate.mjs sample-wide.mp4 --target reels
FAIL  sample-wide.mp4 -> Instagram Reels (9:16)
  표시 1920x1080 | 인코딩 1920x1080 | 회전 0 | SAR 1:1 | 2s | 30fps | h264/yuv420p | 소리 aac
  X 화면에 보이는 크기가 1920x1080(가로 영상)이어서 Instagram Reels에 필요한 비율 9:16에 맞지 않습니다.
    Display size 1920x1080 does not match the 9:16 required for Instagram Reels.
  Technical check only. Look at the real upload preview too. 기술 검사만 통과한 것이니 실제 업로드 미리보기도 눈으로 확인하세요.
```

How to read it: the first word, `PASS` or `FAIL`, is the verdict. "표시" (display) is the size viewers see and "인코딩" (encoded) is the size stored in the file; they differ when a rotation flag or the pixel shape (SAR) is involved. A line starting with `X` is a reason to stop; a line starting with `!` is a warning that does not stop you. The messages are printed in Korean and English, and the English line is under the Korean one.

**Troubleshooting.** Every row below was reproduced.

| Symptom | Cause | Fix |
|---|---|---|
| `ffprobe failed: spawnSync ffprobe ENOENT` and `(Install FFmpeg or set FFPROBE_PATH.)` (exit code 2) | The computer cannot find `ffprobe`: FFmpeg is missing or not on PATH. | Install FFmpeg as shown above and reopen the terminal. If you know where it is, set the `FFPROBE_PATH` environment variable to the full path of `ffprobe`. |
| `ffprobe failed: spawnSync C:\nope\ffprobe.exe ENOENT` | The path in `FFPROBE_PATH` points to a file that does not exist. | Fix the typo, or unset the variable so the `ffprobe` on PATH is used. |
| `file not found: nofile.mp4` (exit code 2) | Wrong file name or wrong folder. | Run `ls` (Mac) or `dir` (Windows) to confirm you are in the folder that holds the file. |
| `usage: node video-gate.mjs <video> --target ...` (exit code 2) | `--target` is missing, or the name is not valid, such as `--target insta`. | Use one of `reels`, `shorts`, `tiktok`, `youtube`, `threads-landscape`, `square`, or set your own with `--ratio 4:5`. |
| `ffprobe failed: ... moov atom not found` and `Invalid data found` (exit code 2) | The file is not a video, or an export was cut short and the file is broken. | Export again from your editor, then check it. |
| `FAIL` with `X ...(가로 영상)...` (exit code 1) | The video ratio does not match the target. | Re-edit to the right ratio. Do not stretch it; crop or add padding instead. |
| `X ... SAR 2:1` (exit code 1) | The pixel shape is not square, so the picture can look stretched after upload. | Rebuild it with `ffmpeg -i in.mp4 -vf "scale=1080:1920,setsar=1" -c:a copy out.mp4`. |
| `! Below the recommended 1080x1920.` and `! No audio track.` | Warnings. It passed, but the quality is low or there is no sound. | Fine if intended; otherwise export again. |

**Credits.**
- Uses [ffprobe](https://ffmpeg.org/ffprobe.html) from FFmpeg (installed separately). Ratio and resolution targets are commonly published platform values collected by the author; platforms change their rules, so check the current help pages and the real upload preview.

Install: `/plugin marketplace add reedodev/social-video-gate` then `/plugin install social-video-gate@social-video-gate`, or copy `skills/social-video-gate` into `~/.claude/skills/`. See [SKILL.md](skills/social-video-gate/SKILL.md) for the full procedure. MIT License; third-party models, fonts and libraries keep their own licenses.

More skills by the same author: [reedo-skills](https://github.com/reedodev/reedo-skills), the index of all twelve.
