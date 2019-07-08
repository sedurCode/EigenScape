# import datatools as dt
#
# # def create_test_setup(dataset_dir, seg_length=30, **kwargs):
# #     def make_folds(n_folds=4, output_text_dir='fold_info',
# #                     output_audio_dir='audio'):
#
#
# dataSet = '/Volumes/Data/EigenScape/Eigenmike Audio/Ambisonic (1st Order)'
# seg_length = 90
# n_folds = 1
#
# dt.create_test_setup(dataSet, seg_length,n_folds=n_folds)


import eigenscape
##### Feature extraction
data, indices, label_list = eigenscape.build_audio_featureset(
                              eigenscape.calculate_dirac,
                                dataset_directory='audio/')

from sklearn.preprocessing import StandardScaler

X = data[:, :-1]
y = data[:, -1] # extract data vectors and class targets from array
scaler = StandardScaler() # set up scaler object

train_info = eigenscape.extract_info('fold_info/fold4_train.txt')
test_info = eigenscape.extract_info('fold_info/fold4_test.txt')
# read in file lists (4th fold here)

train_indices = eigenscape.vectorise_indices(train_info)
# make incremental vector of train data indices

X_train = X[train_indices]
y_train = y[train_indices]
# extract training data and labels from full arrays

classifier = eigenscape.MultiGMMClassifier() # set up multi GMM classifier

classifier.fit(scaler.fit_transform(X_train), y_train)
# train classifier on scaled training data and fit scaler to training data

y_test, y_score = eigenscape.BOF_audio_classify(
    classifier, scaler.transform(X), y, test_info, indices)
# classify entire audio clips (specified in test_info) by summing output from
# classifier object across all frames of the clip

##### Plotting results
confmat = eigenscape.plot_confusion_matrix(y_test, y_score, label_list)
