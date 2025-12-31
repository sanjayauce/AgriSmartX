import torch

class CNN(torch.nn.Module):
    def __init__(self, num_classes):
        super(CNN, self).__init__()
        self.conv_layers = torch.nn.Sequential(
            torch.nn.Conv2d(3, 32, 3, 1, 1),
            torch.nn.ReLU(),
            torch.nn.BatchNorm2d(32),
            torch.nn.Conv2d(32, 32, 3, 1, 1),
            torch.nn.ReLU(),
            torch.nn.BatchNorm2d(32),
            torch.nn.MaxPool2d(2),

            torch.nn.Conv2d(32, 64, 3, 1, 1),
            torch.nn.ReLU(),
            torch.nn.BatchNorm2d(64),
            torch.nn.Conv2d(64, 64, 3, 1, 1),
            torch.nn.ReLU(),
            torch.nn.BatchNorm2d(64),
            torch.nn.MaxPool2d(2),

            torch.nn.Conv2d(64, 128, 3, 1, 1),
            torch.nn.ReLU(),
            torch.nn.BatchNorm2d(128),
            torch.nn.Conv2d(128, 128, 3, 1, 1),
            torch.nn.ReLU(),
            torch.nn.BatchNorm2d(128),
            torch.nn.MaxPool2d(2),

            torch.nn.Conv2d(128, 256, 3, 1, 1),
            torch.nn.ReLU(),
            torch.nn.BatchNorm2d(256),
            torch.nn.Conv2d(256, 256, 3, 1, 1),
            torch.nn.ReLU(),
            torch.nn.BatchNorm2d(256),
            torch.nn.MaxPool2d(2),

            torch.nn.Conv2d(256, 256, 3, 1, 1),
            torch.nn.ReLU(),
            torch.nn.BatchNorm2d(256),
        )
        self.avgpool = torch.nn.AdaptiveAvgPool2d((7, 7))
        self.dense_layers = torch.nn.Sequential(
            torch.nn.Dropout(0.4),
            torch.nn.Linear(256 * 7 * 7, 1024),
            torch.nn.ReLU(),
            torch.nn.Dropout(0.4),
            torch.nn.Linear(1024, num_classes)
        )

    def forward(self, x):
        x = self.conv_layers(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.dense_layers(x)
        return x 