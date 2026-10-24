// Recordings that live in the app itself (moved from Google Drive 24 Oct 2026).
// A driveAudio block whose Drive id is in here plays from /31-touch-points/audio/
// with the app's own player instead of a Drive box.
export const LOCAL_AUDIO = new Set<string>([
  "1-7kHzl2T-kBXJIae6uk-3u_KMeDV9Mks",
  "10JkmLg-WOZtQo86U9qtxjlO9yX-LS3_4",
  "12t1IVCP9J06lKlrcdI5dNmMLq9C4baYz",
  "13tKa_R4LyGEba1sJz08VV0fwL0d8lXZP",
  "1AGKYoksO3qGYID0yMKbN-OSVzd4GnBRV",
  "1BcgMGBCB-fCKmOAfopwOMAxK1X7iDzgw",
  "1CkIXqU2NXmGQ95T8B90ctd1jse0JIeCB",
  "1KeZfIiJ_NV3idc8WTKL4f_6aecjTtgg_",
  "1NBGgj5bJQeQMM_Gw6nA-dTlMd3UU2Snc",
  "1PDQcsqa7RVUsV3Hfy48r5j0r1HxWJFDQ",
  "1PJUcTwFeBTU_SC3jBZD9zKeWfWgghlqy",
  "1WsROpJzedUlKTAwUzpQMDIFaaU-TSAFl",
  "1YcwwYfxhBYYPKGO6misNmXkSvjArD_Dg",
  "1i72EYk3Dig8CYg_qIE82ld_Q_vUeJfdA",
  "1k3mYH255_J5QQ5CFpPBoDzL6zLa84wVa",
  "1rxaVukGXnP14ZTfpUCdEHrdkpCxQLtJY",
  "1t9hImvVQB1uehBWt8YYB-CPaR9Npi-ai",
  "1uvg9gND_rhtsdB4ElqrCR1n8lhfY8K2a",
  "1vOBlcZbFpt0XxO9MYuSzbxxaWvWWBzzu",
  "1zJJ5oMZYxiPkytFmNK6uTnVoVP-3Nkk5",
]);
export const localAudioSrc = (id: string) => `/31-touch-points/audio/${id}.m4a`;

// The Sacred No lesson videos, moved from Google Drive into the app 24 Oct
// 2026 (Juliette: "all those Google files, because they're videos, go in
// there properly"). Re-encoded to 720p for phones; poster = a frame at 4s.
export const LOCAL_VIDEO = new Set<string>([
  "182L01c5FYbPJ8YBqSH48wQKAA-r2vaXJ",
  "14uK4B3K4-Hl44Rm4MlsLHTi1x1tud3YF",
  "1Rvuo5_Ote8UbofjTLt7cMMGnJlxMI3SN",
  "15cXfLYktIj09TNPwDWHLyDCPoeNdcZid",
  "1hmSbssx6IV04FMkRGUzw_22AmAwsVqa_",
  "1z6wmOgueesXQaxSTy3vvikyeP6eA02tt",
  "1NOtDXfaB3prEpybDSUTiSkAOQK-BWh2K",
  "1HosI7C7hX42wX19ieqylne-SOHTYZDue",
  "1ky9FWoeBl0jsxm1-D_BRDOShH9clqGkS",
]);
export const localVideoSrc = (id: string) => `/sacred-no/video/${id}.mp4`;
export const localVideoPoster = (id: string) => `/sacred-no/video/${id}.jpg`;
