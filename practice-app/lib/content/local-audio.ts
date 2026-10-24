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
