import numpy as np
import soundfile as sf
import progressbar as pb
import glob
import os
import shutil
import random

dir_path = os.getcwd()
file_list = glob.glob(os.getcwd() + '/audio/*')
progbar = pb.ProgressBar(len(file_list))
progbar.start()
directories = next(os.walk('./audio/'))[1]
target_dir = os.getcwd() + '/selection/'
os.makedirs(target_dir, exist_ok=True)

for directory in directories:
    print(directory)
    samples = next(os.walk('./audio/'+ directory))[2]
    nSamples = len(samples)
    print('nSamples = ' + str(nSamples))
    sel1 = random.randint(0, nSamples-1)
    sel2 = random.randint(0, nSamples-1)
    if sel2 == sel1:
        sel2 = random.randint(0, nSamples-1)
    print('sel2 = ' + str(sel2))
    print('sel1 = ' + str(sel1))
    file1 = dir_path + '/audio/' + directory + '/' + samples[sel1]
    file2 = dir_path + '/audio/' + directory + '/' + samples[sel2]
    print('file1 = ' + file1)
    print('file2 = ' + file2)
    shutil.copy(file1, target_dir)
    shutil.copy(file2, target_dir)
    # print(nSamples)
    # print('./audio'+ directory + '/')
    # print(os.walk('./audio'+ directory + '/'))
    # walker = os.walk('./audio'+ directory + '/')
    # nSamples = len(next(os.walk('./audio/Woodland/'))[2])
    # nSamples = len(next(os.walk('./audio'+ directory + '/'))[2])
    # print(walker)
    # nSamples = len(next(os.walk('./audio/Woodland/'))[2])
    # nSamples = len(next(os.walk('./audio'+ directory))[2])
    # print(nSamples)
    # len(next(os.walk('./audio/Woodland/'))[2])
