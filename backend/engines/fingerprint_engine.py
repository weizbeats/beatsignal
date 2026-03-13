import librosa
import numpy as np

FAN_VALUE = 5


def generate_fingerprint(audio_file):

    y, sr = librosa.load(audio_file, mono=True)

    spectrogram = np.abs(librosa.stft(y))

    peaks = get_peaks(spectrogram)

    hashes = generate_hashes(peaks)

    return hashes


def get_peaks(spectrogram):

    peaks = []

    freq_bins, time_bins = spectrogram.shape

    for t in range(time_bins):

        column = spectrogram[:, t]

        threshold = np.mean(column) * 5

        for f in range(freq_bins):

            if column[f] > threshold:

                peaks.append((f, t))

    return peaks


def generate_hashes(peaks):

    hashes = []

    for i in range(len(peaks)):

        for j in range(1, FAN_VALUE):

            if i + j < len(peaks):

                f1, t1 = peaks[i]
                f2, t2 = peaks[i + j]

                delta = t2 - t1

                if 0 <= delta <= 200:

                    h = hash((f1, f2, delta))

                    hashes.append((h, t1))

    return hashes
